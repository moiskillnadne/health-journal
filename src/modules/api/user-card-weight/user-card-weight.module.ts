import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardWeightHistoryEntity } from '../../../database/entities/user-card-weight-history.entity'
import { UserCardModule } from '../user-card/user-card.module'
import { UserCardWeightCrudService } from './user-card-weight.crud'
import { UserCardWeightController } from './user-card-weight.controller'
import { UserCardWeightService } from './user-card-weight.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardWeightHistoryEntity]), UserCardModule],
  controllers: [UserCardWeightController],
  providers: [UserCardWeightCrudService, UserCardWeightService],
  exports: [UserCardWeightCrudService],
})
export class UserCardWeightModule {}
