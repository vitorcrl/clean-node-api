import { httpResponse } from "../protocols/http";

export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  body: error,
});
export const serverError= (): httpResponse => ({
  statusCode: 500,
  body: new Error("Internal server error"),
})