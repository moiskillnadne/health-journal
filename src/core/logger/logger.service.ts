import { Credentials } from 'aws-sdk'
import { ConsoleLogger, Inject, Injectable } from '@nestjs/common'
import * as winston from 'winston'
import * as WinstonCloudWatch from 'winston-cloudwatch'
import { Environment } from '../../constants/config.constants'
import { ASYNC_STORAGE } from '../../constants/async-local-storage.constants'
import { AsyncLocalStorage } from 'async_hooks'

const messageFormatter = (info: winston.LogEntry) => {
  return `${info.level}: ${info.traceId || ''} ${info.message}`
}

const logger = winston.createLogger({
  format: winston.format.printf(messageFormatter),
  transports: [new winston.transports.Console({})],
})

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(@Inject(ASYNC_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>) {
    super()

    if (process.env[Environment.CloudWatchGroup] && process.env[Environment.CloudWatchStream]) {
      const config: WinstonCloudWatch.CloudwatchTransportOptions = {
        name: 'main',
        awsOptions: {
          region: process.env[Environment.CognitoRegion],
          credentials: new Credentials(
            process.env[Environment.AwsAccessKey],
            process.env[Environment.AwsSecretAccesskey],
          ),
        },
        logGroupName: process.env[Environment.CloudWatchGroup],
        logStreamName: process.env[Environment.CloudWatchStream],
        messageFormatter,
      }

      logger.add(new WinstonCloudWatch(config))
    }
  }

  log(message: any, stack?: string, context?: string) {
    logger.info(this.getMessage(message, context), { traceId: this.getTraceId() })
  }

  warn(message: any, stack?: string, context?: string) {
    logger.warn(this.getMessage(message, context), {
      traceId: this.getTraceId(),
    })
  }

  error(message: any, stack?: string, context?: string) {
    logger.error(this.getMessage(message.stack || message.message || message || stack, context), {
      traceId: this.getTraceId(),
    })
  }

  getTraceId() {
    return this.asyncStorage.getStore()?.get('traceId')
  }

  private getMessage(message: any, context?: string) {
    return context ? `[ ${context} ] ${message}` : message
  }
}
