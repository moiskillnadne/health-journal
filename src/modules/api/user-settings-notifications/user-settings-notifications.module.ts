import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UserSettingsNotificationsController } from './user-settings-notifications.controller'
import { UserSettingsNotificationsCrudService } from './user-settings-notifications.crud'
import { UserSettingsNotificationsService } from './user-settings-notifications.service'
import { UserSettingsNotificationsEntity } from '../../../database/entities/user-settings-notifications.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserSettingsNotificationsEntity])],
  controllers: [UserSettingsNotificationsController],
  providers: [UserSettingsNotificationsService, UserSettingsNotificationsCrudService],
  exports: [UserSettingsNotificationsCrudService],
})
export class UserSettingsNotificationsModule {}
