import { IAuthenticationModel } from '../../../domain/usecases/authentication'
import { IHashCompare } from '../../protocols/cryptography/hash-compare'
import { ITokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IUpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
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
const makeTokenGenerator = (): ITokenGenerator => {
    class tokenGeneratorStub implements ITokenGenerator {
        async generate(id: string): Promise<string> {
            return new Promise((resolve) => resolve('any_token'))
        }
    }
    return new tokenGeneratorStub()
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
    tokenGeneratorStub: ITokenGenerator
    updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}
const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashCompareStub = makeHashCompare()
    const tokenGeneratorStub = makeTokenGenerator()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        tokenGeneratorStub,
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
    test('Should call TokenGenerator with correct id', async () => {
        const { sut, tokenGeneratorStub } = makeSut()
        const compareSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenCalledWith('valid_id')
    })

    test('Should throw if  TokenGenerator throws', async () => {
        const { sut, tokenGeneratorStub } = makeSut()
        jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('Should call TokenGenerator with correct id', async () => {
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
})
