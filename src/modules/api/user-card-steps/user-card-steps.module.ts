import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardStepsHistoryEntity } from '../../../database/entities/user-card-steps-history.entity'

import { UserCardModule } from '../user-card/user-card.module'

import { UserCardStepsCrudService } from './user-card-steps.crud'
import { UserCardStepsService } from './user-card-steps.service'
import { UserCardStepsController } from './user-card-steps.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardStepsHistoryEntity]), UserCardModule],
  controllers: [UserCardStepsController],
  providers: [UserCardStepsCrudService, UserCardStepsService],
  exports: [UserCardStepsCrudService, UserCardStepsService],
})
export class UserCardStepsModule {}
