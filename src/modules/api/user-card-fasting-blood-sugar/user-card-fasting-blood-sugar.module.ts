import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardFastingBloodSugarHistoryEntity } from '../../../database/entities/user-card-fasting-blood-sugar-history.entity'
import { UserCardModule } from '../user-card/user-card.module'
import { UserCardFastingBloodSugarController } from './user-card-fasting-blood-sugar.controller'
import { UserCardFastingBloodSugarCrudService } from './user-card-fasting-blood-sugar.crud'
import { UserCardFastingBloodSugarService } from './user-card-fasting-blood-sugar.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardFastingBloodSugarHistoryEntity]), UserCardModule],
  controllers: [UserCardFastingBloodSugarController],
  providers: [UserCardFastingBloodSugarCrudService, UserCardFastingBloodSugarService],
  exports: [UserCardFastingBloodSugarCrudService, UserCardFastingBloodSugarService],
})
export class UserCardFastingBloodSugarModule {}
