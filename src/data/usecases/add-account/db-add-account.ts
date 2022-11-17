import {
    AddAccount,
    AddAccountModel,
    AccountModel,
    Encrypter,
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    constructor(encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(accountData.password)
        return new Promise((resolve) => resolve(null))
    }
}
