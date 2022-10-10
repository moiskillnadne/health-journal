import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { UserNotificationsPredefinedEntity } from '../../../database/entities/user-notifications-predefined.entity'
import { UserNotificationsCustomEntity } from '../../../database/entities/user-notifications-custom.entity'

import { S3Module } from '../../../integrations/s3/s3.module'

import { UserNotificationsController } from './user-notifications.controller'
import { UserNotificationsService } from './user-notifications.service'
import { UserNotificationsCrudService } from './user-notifications.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserNotificationsPredefinedEntity, UserNotificationsCustomEntity]), S3Module],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsCrudService, UserNotificationsService],
  exports: [UserNotificationsCrudService, UserNotificationsService],
})
export class UserNotificationsModule {}
