import { HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common'
import { NotFoundError } from '../errors/not-found.error'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'

export function ParamUIID(property: string) {
  return Param(
    property,
    new ParseUUIDPipe({
      version: '4',
      errorHttpStatusCode: HttpStatus.NOT_FOUND,
      exceptionFactory: () =>
        new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND),
    }),
  )
}
