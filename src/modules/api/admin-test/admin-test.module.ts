import { Module } from '@nestjs/common'
import { AdminTestController } from './admin-test.controller'

@Module({
  controllers: [AdminTestController],
})
export class AdminTestModule {}
