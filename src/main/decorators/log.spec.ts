import {
    Controller,
    HttpRequest,
    httpResponse,
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Decorator', () => {
    test('Should Call Controller Handle', async () => {
        class ControllerStub implements Controller {
            async handle(httpRequest: HttpRequest): Promise<httpResponse> {
                const httpResponse: httpResponse = {
                    statusCode: 200,
                    body: {
                        name: 'any_name',
                    },
                }
                return new Promise((resolve) => resolve(httpResponse))
            }
        }
        const controllerStub = new ControllerStub()
        const sut = new LogControllerDecorator(controllerStub)
        const handleSpy = jest.spyOn(sut, 'handle')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
})
