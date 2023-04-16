import {
    Authentication,
    IAuthenticationModel,
} from '../../../domain/usecases/authentication'
import { IHashCompare } from '../../protocols/cryptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashCOmpare: IHashCompare
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashCOmpare = hashCOmpare
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
        }
        return null
    }
}
