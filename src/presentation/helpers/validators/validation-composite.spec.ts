import { InvalidParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
    sut: ValidationComposite
    validationStubs: Validation[]
}

const makeRequiredFieldValidation = (): Validation => {
    class RequiredFieldValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new RequiredFieldValidationStub()
}
const makeCompareFieldsValidation = (): Validation => {
    class CompareFieldsValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new CompareFieldsValidationStub()
}
const makeSut = (): SutTypes => {
    const validationStubs = [
        makeRequiredFieldValidation(),
        makeCompareFieldsValidation(),
    ]
    const sut = new ValidationComposite(validationStubs)
    return {
        sut,
        validationStubs,
    }
}
describe('ValidationComposite', () => {
    test('Should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
            new InvalidParamError('any_field')
        )
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'wrong_value',
        })
        expect(error).toEqual(new InvalidParamError('any_field'))
    })
    test('Should return the first error if more than one validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
            new Error()
        )
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
            new InvalidParamError('any_field')
        )
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'wrong_value',
        })
        expect(error).toEqual(new Error())
    })
    test('Should not return if validation succeeds', () => {
        const { sut } = makeSut()
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'any_value',
        })
        expect(error).toBeFalsy()
    })
})
