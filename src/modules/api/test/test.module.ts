import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TestController } from './test.controller'

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [TestController],
  providers: [],
})
export class TestModule {}
