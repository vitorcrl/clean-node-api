import { HttpRequest, httpResponse } from "./http";

export interface Controller {
  handle (httpRequest: HttpRequest):httpResponse 
}