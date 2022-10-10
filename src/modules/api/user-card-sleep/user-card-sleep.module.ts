import { UserCardModule } from './../user-card/user-card.module'
import { Module } from '@nestjs/common'
import { UserCardSleepController } from './user-card-sleep.controller'
import { UserCardSleepCrudService } from './user-card-sleep.crud'
import { UserCardSleepService } from './user-card-sleep.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserCardSleepHistoryEntity } from '../../../database/entities/user-card-sleep-history.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardSleepHistoryEntity]), UserCardModule],
  controllers: [UserCardSleepController],
  providers: [UserCardSleepService, UserCardSleepCrudService],
  exports: [UserCardSleepCrudService],
})
export class UserCardSleepModule {}
