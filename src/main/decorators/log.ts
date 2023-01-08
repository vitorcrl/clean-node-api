import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import {
    Controller,
    HttpRequest,
    httpResponse,
} from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
    // Decorator: Seria um interceptador de requisições
    // que adiciona alguma funcionalidade a mais
    // ao controller original

    private readonly controller: Controller
    private readonly logErrorRepository: LogErrorRepository
    constructor(
        controller: Controller,
        logErrorRepository: LogErrorRepository
    ) {
        this.controller = controller
        this.logErrorRepository = logErrorRepository
    }
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)
        if (httpResponse.statusCode === 500) {
            await this.logErrorRepository.logError(httpResponse.body.stack)
        }
        return httpResponse
    }
}
