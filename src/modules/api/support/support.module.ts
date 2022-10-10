import { SesModule } from './../../../integrations/ses/ses.module'
import { Module } from '@nestjs/common'
import { SupportController } from './support.controller'
import { SupportService } from './support.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [SesModule, ConfigModule],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [],
})
export class SupportModule {}
