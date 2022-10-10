import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardAfterMealBloodSugarHistoryEntity } from '../../../database/entities/user-card-after-meal-blood-sugar-history.entity'

import { UserCardModule } from '../user-card/user-card.module'

import { UserCardAfterMealBloodSugarCrudService } from './user-card-after-meal-blood-sugar.crud'
import { UserCardAfterMealBloodSugarService } from './user-card-after-meal-blood-sugar.service'
import { UserCardAfterMealBloodSugarController } from './user-card-after-meal-blood-sugar.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardAfterMealBloodSugarHistoryEntity]), UserCardModule],
  providers: [UserCardAfterMealBloodSugarCrudService, UserCardAfterMealBloodSugarService],
  controllers: [UserCardAfterMealBloodSugarController],
  exports: [UserCardAfterMealBloodSugarCrudService, UserCardAfterMealBloodSugarService],
})
export class UserCardAfterMealBloodSugarModule {}
