import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFieldValidation', () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = new RequiredFieldValidation('any_field')
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('any_field'))
    })
    //nao retornar nada se der certo, ou seja, se o campo for preenchido
    test('Should not return if validation succeeds', () => {
        const sut = new RequiredFieldValidation('any_field')
        const error = sut.validate({ any_field: 'any_name' })
        expect(error).toBeFalsy()
    })
})
