import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { throwError } from 'rxjs'
import { isEmpty } from 'lodash'
import { catchError, tap } from 'rxjs/operators'
import { LoggerService } from '../logger/logger.service'

const PRIVATE_BODY_FIELDS = ['password', 'oldPassword', 'newPassword', 'code', 'accessToken', 'refreshToken']

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    if (request.user) {
      this.loggerService.log(`USER ${request.user.id}`)
    }

    this.loggerService.log(`REQUEST ${request.method} ${request.originalUrl}`)

    if (!isEmpty(request.body)) {
      this.loggerService.log(JSON.stringify(this.formatRequestBody(request.body)))
    }

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse()
        this.loggerService.log(`RESPONSE ${request.method} ${response.statusCode} ${request.originalUrl}`)

        if (!isEmpty(data)) {
          this.loggerService.log(JSON.stringify(data))
        }
      }),
      catchError((error) => {
        this.loggerService.error(`ERROR ${this.loggerService.getTraceId()} ${error.message}`, error.stack)

        return throwError(error)
      }),
    )
  }

  private formatRequestBody(body: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(body).reduce((result, key) => {
      if (PRIVATE_BODY_FIELDS.includes(key)) {
        result[key] = '*****'
      } else {
        result[key] = body[key]
      }

      return result
    }, {})
  }
}
