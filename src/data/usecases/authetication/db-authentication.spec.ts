import { DbAuthentication } from './db-authentication'
import {
    IAuthenticationModel,
    IHashCompare,
    IEncrypter,
    LoadAccountByEmailRepository,
    IUpdateAccessTokenRepository,
    AccountModel,
} from './db-authetication-protocols'

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
const makeEncrypterStub = (): IEncrypter => {
    class encrypterStub implements IEncrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise((resolve) => resolve('any_token'))
        }
    }
    return new encrypterStub()
}
const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
    class updateAccessTokenRepositoryStub
        implements IUpdateAccessTokenRepository
    {
        async update(id: string, token: string): Promise<string> {
            return new Promise((resolve) => resolve(''))
        }
    }
    return new updateAccessTokenRepositoryStub()
}
interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashCompareStub: IHashCompare
    encrypterStub: IEncrypter
    updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}
const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashCompareStub = makeHashCompare()
    const encrypterStub = makeEncrypterStub()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        encrypterStub,
        updateAccessTokenRepositoryStub,
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
    test('Should throw if hashCompare throws', async () => {
        const { sut, hashCompareStub } = makeSut()
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('Should return null if hashCompare returns ', async () => {
        const { sut, hashCompareStub } = makeSut()
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
            new Promise((resolve, reject) => resolve(false))
        )
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })
    test('Should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const compareSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenCalledWith('valid_id')
    })

    test('Should throw if  Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('Should call Encrypter with correct id', async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBe('any_token')
    })
    test('Should call updateAcessTokenRepository with correct Values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
        await sut.auth(makeFakeAuthentication())
        expect(updateSpy).toHaveBeenCalledWith('valid_id', 'any_token')
    })
    test('Should throw if  updateAccessTokenRepositoryStub throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(
            updateAccessTokenRepositoryStub,
            'update'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
})
