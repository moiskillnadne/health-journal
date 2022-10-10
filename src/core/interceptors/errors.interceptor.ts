import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  PayloadTooLargeException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { Observable, catchError, throwError } from 'rxjs'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'
import { BadRequestError } from '../errors/bad-request.error'
import { ForbiddenError } from '../errors/forbidden.error'
import { InternalServerError } from '../errors/internal-server.error'
import { NotFoundError } from '../errors/not-found.error'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { ValidationError } from '../errors/validation.error'
import { getI18nContextFromRequest, I18nValidationException } from 'nestjs-i18n'
import { errorFormat } from '../helpers/error-format'
import { QueryFailedError } from 'typeorm'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  // constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof PayloadTooLargeException) {
          return throwError(
            new BadRequestException({
              code: HttpStatus.BAD_REQUEST,
              message: error.message,
            }),
          )
        }

        if (error instanceof QueryFailedError) {
          return throwError(
            new InternalServerErrorException({
              httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.driverError.detail,
              code: error.name,
              details: {
                message: error.message,
                query: error.query,
                errorInfo: {
                  ...error.driverError,
                },
              },
            }),
          )
        }

        if (error instanceof BadRequestError || error instanceof ValidationError) {
          return throwError(new BadRequestException(error.toPlainObject()))
        }

        if (error instanceof NotFoundError) {
          return throwError(new NotFoundException(error.toPlainObject()))
        }

        if (error instanceof UnauthorizedError) {
          return throwError(new ForbiddenException(error.toPlainObject()))
        }

        if (error instanceof ForbiddenError) {
          return throwError(new ForbiddenException(error.toPlainObject()))
        }

        if (error instanceof InternalServerError) {
          return throwError(new InternalServerErrorException(error.toPlainObject()))
        }

        // this.loggerService.error(`ERROR ${this.loggerService.getTraceId()} ${error.message}`, error.stack)

        if (error instanceof I18nValidationException) {
          const request = context.switchToHttp().getRequest()
          const i18n = getI18nContextFromRequest(request)
          const result = errorFormat(error.errors)

          const firstError = result[0]

          return throwError(
            new BadRequestException({
              httpCode: HttpStatus.BAD_REQUEST,
              code: ErrorCodes.ValidationFailed,
              message: i18n.t(firstError.paths[0], { args: { property: firstError.property } }),
              details: {
                name: error.name,
                errors: error.errors,
              },
            }),
          )
        }

        // This exceptions for DTO Validations
        if (error instanceof BadRequestException) {
          const response = error.getResponse()
          return throwError(
            new BadRequestException({
              httpCode: response['statusCode'],
              code: ErrorCodes.ValidationFailed,
              message: DictionaryErrorMessages.ValidationFailed,
              details: {
                invalidFields: response['message'],
              },
            }),
          )
        }

        return throwError(
          new InternalServerErrorException({
            code: ErrorCodes.InternalServerError,
            message: DictionaryErrorMessages.InternalServerError,
            ...(process.env.NODE_ENV === 'development'
              ? {
                  details: {
                    message: error.message,
                    stack: error.stack,
                  },
                }
              : {}),
          }),
        )
      }),
    )
  }
}
