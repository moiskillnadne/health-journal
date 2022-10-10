import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardRandomBloodSugarHistoryEntity } from '../../../database/entities/user-card-random-blood-sugar-history.entity'

import { UserCardModule } from '../user-card/user-card.module'

import { UserCardRandomBloodSugarCrudService } from './user-card-random-blood-sugar.crud'
import { UserCardRandomBloodSugarController } from './user-card-random-blood-sugar.controller'
import { UserCardRandomBloodSugarService } from './user-card-random-blood-sugar.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardRandomBloodSugarHistoryEntity]), UserCardModule],
  controllers: [UserCardRandomBloodSugarController],
  providers: [UserCardRandomBloodSugarCrudService, UserCardRandomBloodSugarService],
  exports: [UserCardRandomBloodSugarCrudService, UserCardRandomBloodSugarService],
})
export class UserCardRandomBloodSugarModule {}
