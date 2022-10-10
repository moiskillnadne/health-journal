import { UserCardModule } from './../user-card/user-card.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserCardWaterHistoryEntity } from '../../../database/entities/user-card-water.entity'
import { UserCardWaterController } from './user-card-water.controller'
import { UserCardWaterCrudService } from './user-card-water.crud'
import { UserCardWaterService } from './user-card-water.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardWaterHistoryEntity]), UserCardModule],
  controllers: [UserCardWaterController],
  providers: [UserCardWaterService, UserCardWaterCrudService],
  exports: [UserCardWaterCrudService],
})
export class UserCardWaterModule {}
