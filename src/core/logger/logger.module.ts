import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { AsyncLocalStorage } from 'async_hooks'
import { ASYNC_STORAGE } from '../../constants/async-local-storage.constants'

const asyncLocalStorage = new AsyncLocalStorage()

@Module({
  imports: [ConfigModule],
  providers: [LoggerService, { provide: ASYNC_STORAGE, useValue: asyncLocalStorage }],
  exports: [LoggerService],
})
export class LoggerModule {}
