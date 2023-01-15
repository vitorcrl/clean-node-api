import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, httpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
    constructor(private readonly emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        if (!httpRequest.body.email) {
            return badRequest(new MissingParamError('email'))
        } else if (!httpRequest.body.password) {
            return badRequest(new MissingParamError('password'))
        }
        const isValid = this.emailValidator.isValid(httpRequest.body.email)
        if (!isValid) {
            return badRequest(new InvalidParamError('email'))
        }
    }
}
