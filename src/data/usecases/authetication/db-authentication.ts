import {
    Authentication,
    IAuthenticationModel,
    IHashCompare,
    IEncrypter,
    LoadAccountByEmailRepository,
    IUpdateAccessTokenRepository,
} from './db-authetication-protocols'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashCOmpare: IHashCompare,
        private readonly tokenGenerator: IEncrypter,
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
                const accessToken = await this.tokenGenerator.encrypt(
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
