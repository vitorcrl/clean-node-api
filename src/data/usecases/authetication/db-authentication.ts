import {
    Authentication,
    IAuthenticationModel,
} from '../../../domain/usecases/authentication'
import { IHashCompare } from '../../protocols/cryptography/hash-compare'
import { ITokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashCOmpare: IHashCompare,
        private readonly tokenGenerator: ITokenGenerator
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashCOmpare = hashCOmpare
        this.tokenGenerator = tokenGenerator
    }

    async auth(authentication: IAuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(
            authentication.email
        )
        if (account) {
            await this.hashCOmpare.compare(
                authentication.password,
                account.password
            )
            await this.tokenGenerator.generate(account.id)
        }
        return null
    }
}
