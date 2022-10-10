import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardHba1cHistoryEntity } from '../../../database/entities/user-card-hba1c-history.entity'

import { UserCardHba1cService } from './user-card-hba1c.service'
import { UserCardHba1cCrudService } from './user-card-hba1c.crud'
import { UserCardHba1cController } from './user-card-hba1c.controller'
import { UserCardModule } from '../user-card/user-card.module'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardHba1cHistoryEntity]), UserCardModule],
  providers: [UserCardHba1cService, UserCardHba1cCrudService],
  controllers: [UserCardHba1cController],
  exports: [UserCardHba1cService, UserCardHba1cCrudService],
})
export class UserCardHba1cModule {}
