export class BadRequestErrorResponse {
  httpCode = 400
  code: string
  message: string
  details: object
}
