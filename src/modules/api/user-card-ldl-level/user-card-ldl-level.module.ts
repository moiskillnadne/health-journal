import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardModule } from '../user-card/user-card.module'

import { UserCardLdlLevelHistoryEntity } from '../../../database/entities/user-card-ldl-level-history.entity'
import { UserCardLdlLevelCrudService } from './user-card-ldl-level.crud'
import { UserCardLdlLevelService } from './user-card-ldl-level.service'
import { UserCardLdlLevelController } from './user-card-ldl-level.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardLdlLevelHistoryEntity]), UserCardModule],
  providers: [UserCardLdlLevelCrudService, UserCardLdlLevelService],
  controllers: [UserCardLdlLevelController],
  exports: [UserCardLdlLevelCrudService, UserCardLdlLevelService],
})
export class UserCardLdlLevelModule {}
