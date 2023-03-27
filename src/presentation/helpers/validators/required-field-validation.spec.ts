import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('any_field')
}
describe('RequiredFieldValidation', () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('any_field'))
    })
    //nao retornar nada se der certo, ou seja, se o campo for preenchido
    test('Should not return if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ any_field: 'any_name' })
        expect(error).toBeFalsy()
    })
})
