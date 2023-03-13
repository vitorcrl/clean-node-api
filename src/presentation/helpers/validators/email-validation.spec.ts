import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors/invalid-param-error'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
    //Stub é um Duble de testes, tipo de mock que retorna algo fixo
    const emailValidatorStub = makeEmailValidator()

    const sut = new EmailValidation('email', emailValidatorStub)
    return {
        sut,
        emailValidatorStub,
    }
}

describe('Email Validation', () => {
    test('Should return an error if emailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'any_email@mail.com' })
        expect(error).toEqual(new InvalidParamError('email'))
    })
    test('Should call email validator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate({ email: 'any_email@mail.com' })
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('Should return 500 if emailValidator Throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})
