import { HttpStatus } from '@nestjs/common'
import { SuccessCodes } from '../constants/responses/codes.success.constants'

export interface IBaseResponse {
  code?: SuccessCodes
  message?: string
  httpCode?: HttpStatus
  details?: Record<string, unknown>
}
