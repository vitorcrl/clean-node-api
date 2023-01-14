import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController
}
const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return { sut }
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
})
