import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { UserCardEntity } from '../../../database/entities/user-card.entity'

import { UserCardBmiController } from './user-card-bmi.controller'
import { UserCardBmiService } from './user-card-bmi.service'
import { UserCardBmiCrudService } from './user-card-bmi.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardEntity])],
  controllers: [UserCardBmiController],
  providers: [UserCardBmiCrudService, UserCardBmiService],
  exports: [UserCardBmiCrudService, UserCardBmiService],
})
export class UserCardBmiModule {}
