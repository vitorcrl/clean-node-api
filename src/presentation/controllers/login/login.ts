import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, httpResponse } from '../../protocols'

export class LoginController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        return badRequest(new MissingParamError('email'))
    }
}
