import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserConditionsEntity } from '../../../database/entities/user-conditions.entity'
import { UserConditionsController } from './user-conditions.controller'

import { UserConditionsCrudService } from './user-conditions.crud'
import { UserConditionsService } from './user-conditions.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserConditionsEntity])],
  controllers: [UserConditionsController],
  providers: [UserConditionsCrudService, UserConditionsService],
  exports: [UserConditionsCrudService],
})
export class UserConditionsModule {}
