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
    constructor(controller: Controller) {
        this.controller = controller
    }
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)
        return httpResponse
    }
}
