import { Authentication } from '../../../data/usecases/authentication'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, httpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly authentication: Authentication
    ) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        try {
            const { email, password } = httpRequest.body
            if (!email) {
                return badRequest(new MissingParamError('email'))
            } else if (!password) {
                return badRequest(new MissingParamError('password'))
            }
            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            await this.authentication.auth(email, password)
        } catch (error) {
            return serverError(error)
        }
    }
}
