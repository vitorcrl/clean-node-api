import { InvalidParamError, MissingParamError } from '../../errors'
import {
    badRequest,
    ok,
    serverError,
    unauthorized,
} from '../../helpers/http-helper'
import {
    Controller,
    HttpRequest,
    httpResponse,
    Authentication,
    Validation,
} from './login-protocols'

export class LoginController implements Controller {
    constructor(
        private readonly authentication: Authentication,
        private readonly validation: Validation
    ) {
        this.authentication = authentication
        this.validation = validation
    }
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { email, password } = httpRequest.body
            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) {
                return unauthorized()
            }
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}
