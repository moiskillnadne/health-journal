import { HttpStatus } from '@nestjs/common'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { CustomResponse } from '../../constants/responses/messages.error.constants'
import { CustomError } from './base.error'
import { IErrorDetails } from './error-details.models'

export class NotFoundError extends CustomError {
  constructor(message: string, code?: ErrorCodes, httpCode?: HttpStatus, details?: IErrorDetails) {
    super(message, code, httpCode, details)
    this.name = CustomResponse.NotFound
  }
}
