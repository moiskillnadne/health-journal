import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardBloodPressureHistoryEntity } from '../../../database/entities/user-card-blood-pressure-history.entity'

import { UserCardModule } from '../user-card/user-card.module'

import { UserCardBloodPressureCrudService } from './user-card-blood-pressure.crud'
import { UserCardBloodPressureService } from './user-card-blood-pressure.service'
import { UserCardBloodPressureController } from './user-card-blood-pressure.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardBloodPressureHistoryEntity]), UserCardModule],
  providers: [UserCardBloodPressureCrudService, UserCardBloodPressureService],
  controllers: [UserCardBloodPressureController],
  exports: [UserCardBloodPressureCrudService, UserCardBloodPressureService],
})
export class UserCardBloodPressureModule {}
