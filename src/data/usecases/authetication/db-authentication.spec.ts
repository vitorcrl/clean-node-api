import { IAuthenticationModel } from '../../../domain/usecases/authentication'
import { IHashCompare } from '../../protocols/cryptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'any_email@gmail.com',
    password: 'hashed_password',
})
const makeFakeAuthentication = (): IAuthenticationModel => ({
    email: 'any_email@gmail.com',
    password: 'any_password',
})
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
        implements LoadAccountByEmailRepository
    {
        async loadByEmail(email: string): Promise<AccountModel> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}
const makeHashCompare = (): IHashCompare => {
    class HashCompareStub {
        async compare(value: string, hash: string): Promise<boolean> {
            return await Promise.resolve(true)
        }
    }
    return new HashCompareStub()
}
interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashCompareStub: IHashCompare
}
const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashCompareStub = makeHashCompare()
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashCompareStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
    }
}
describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        )
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@gmail.com')
    })
    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail'
        ).mockReturnValueOnce(null)
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBe(null)
    })
    test('Should call hashCompare with correct values', async () => {
        const { sut, hashCompareStub } = makeSut()
        const compareSpy = jest.spyOn(hashCompareStub, 'compare')
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenCalledWith(
            'any_password',
            'hashed_password'
        )
    })
})
