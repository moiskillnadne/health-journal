import { HttpStatus } from '@nestjs/common'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { IErrorDetails } from './error-details.models'

export class CustomError extends Error {
  code: ErrorCodes
  httpCode: HttpStatus
  details: IErrorDetails

  constructor(message: string, code: ErrorCodes, httpCode: HttpStatus, details: IErrorDetails) {
    super(message)
    this.code = code
    this.httpCode = httpCode
    this.name = 'CustomError'
    this.details = details
  }

  public toPlainObject() {
    return {
      httpCode: this.httpCode,
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }
}
