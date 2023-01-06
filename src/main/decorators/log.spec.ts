import { ok, serverError } from '../../presentation/helpers/http-helper'
import {
    Controller,
    HttpRequest,
    httpResponse,
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<httpResponse> {
            return new Promise((resolve) => resolve(ok(makeFakeAccount())))
        }
    }
    return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise((resolve) => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}
const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
    },
})
const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
})
interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    LogErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const LogErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(
        controllerStub,
        LogErrorRepositoryStub
    )
    return { sut, controllerStub, LogErrorRepositoryStub }
}

describe('Log Decorator', () => {
    test('Should Call Controller Handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')

        await sut.handle(makeFakeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })
    test('Should return the same result of the controller', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })
    test('Should call LogErrorRepository with correct error if controller reoturn a server Error', async () => {
        const { sut, controllerStub, LogErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(LogErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            new Promise((resolve) => resolve(error))
        )

        await sut.handle(makeFakeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
