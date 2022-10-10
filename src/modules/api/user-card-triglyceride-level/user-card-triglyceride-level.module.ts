import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardTriglycerideLevelHistoryEntity } from '../../../database/entities/user-card-triglyceride-level-history.entity'

import { UserCardModule } from '../user-card/user-card.module'

import { UserCardTriglycerideLevelCrudService } from './user-card-triglyceride-level.crud'
import { UserCardTriglycerideLevelService } from './user-card-triglyceride-level.service'
import { UserCardTriglycerideLevelController } from './user-card-triglyceride-level.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardTriglycerideLevelHistoryEntity]), UserCardModule],
  providers: [UserCardTriglycerideLevelCrudService, UserCardTriglycerideLevelService],
  controllers: [UserCardTriglycerideLevelController],
  exports: [UserCardTriglycerideLevelCrudService, UserCardTriglycerideLevelService],
})
export class UserCardTriglycerideLevelModule {}
