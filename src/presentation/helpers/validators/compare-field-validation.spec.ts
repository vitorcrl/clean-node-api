import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-filed-validation'

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('CompareFields Validation', () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'wrong_value',
        })
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })
    //nao retornar nada se der certo, ou seja, se o campo for preenchido
    test('Should not return if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'any_value',
        })
        expect(error).toBeFalsy()
    })
})
