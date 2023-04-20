import {
    Authentication,
    IAuthenticationModel,
} from '../../../domain/usecases/authentication'
import { IHashCompare } from '../../protocols/cryptography/hash-compare'
import { ITokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IUpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashCOmpare: IHashCompare,
        private readonly tokenGenerator: ITokenGenerator,
        private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashCOmpare = hashCOmpare
        this.tokenGenerator = tokenGenerator
        this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth(authentication: IAuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(
            authentication.email
        )
        if (account) {
            const isValid = await this.hashCOmpare.compare(
                authentication.password,
                account.password
            )
            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(
                    account.id
                )
                await this.updateAccessTokenRepository.update(
                    account.id,
                    accessToken
                )
                return accessToken
            }
        }
        return null
    }
}
