import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserTargetGroupsEntity } from '../../../database/entities/user-target-groups.entity'

import { UserModule } from '../user/user.module'
import { UserCardBmiModule } from '../user-card-bmi/user-card-bmi.module'
import { TargetGroupModule } from '../target-group/target-group.module'

import { UserTargetGroupsCrudService } from './user-target-groups.crud'
import { UserTargetGroupsService } from './user-target-groups.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserTargetGroupsEntity]), UserModule, UserCardBmiModule, TargetGroupModule],
  providers: [UserTargetGroupsCrudService, UserTargetGroupsService],
  exports: [UserTargetGroupsCrudService, UserTargetGroupsService],
})
export class UserTargetGroupsModule {}
