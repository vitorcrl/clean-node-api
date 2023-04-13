import {
    Authentication,
    IAuthenticationModel,
} from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth(authentication: IAuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.loadByEmail(
            authentication.email
        )
        return null
    }
}
