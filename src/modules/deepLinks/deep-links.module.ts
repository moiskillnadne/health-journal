import { Module } from '@nestjs/common'
import { DeepLinksController } from './deep-links.controller'

@Module({
  controllers: [DeepLinksController],
  providers: [],
})
export class DeepLinksModule {}
