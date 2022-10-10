import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TriggersCrudService } from './triggers.crud'
import { TriggersEntity } from '../../../database/entities/triggers.entity'
import { TriggersController } from './triggers.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TriggersEntity])],
  controllers: [TriggersController],
  providers: [TriggersCrudService],
  exports: [TriggersCrudService],
})
export class TriggersModule {}
