import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConditionsEntity } from '../../../database/entities/conditions.entity'

import { ConditionsCrudService } from './conditions.crud'
import { ConditionsController } from './conditions.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ConditionsEntity])],
  providers: [ConditionsCrudService],
  controllers: [ConditionsController],
  exports: [ConditionsCrudService],
})
export class ConditionsModule {}
