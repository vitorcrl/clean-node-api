import { InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}
const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password',
    },
})
interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return { sut, emailValidatorStub }
}
describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password',
            },
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toEqual(
            badRequest(new Error('Missing param: email')).statusCode
        )
    })
    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
            },
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toEqual(
            badRequest(new Error('Missing param: password')).statusCode
        )
    })
    test('Should return 400 if an invalid Emais is Provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toEqual(
            badRequest(new InvalidParamError('email')).statusCode
        )
    })
    test('Should call EmailValidator with correct informations', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith(makeFakeRequest().body.email)
    })
    test('Should return 500 if email validator Throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
