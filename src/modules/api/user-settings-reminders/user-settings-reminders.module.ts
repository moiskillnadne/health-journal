import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserSettingsRemindersEntity } from '../../../database/entities/user-settings-reminders.entity'

import { UserSettingsRemindersCrudService } from './user-settings-reminders.crud'
import { UserSettingsRemindersService } from './user-settings-reminders.service'
import { UserSettingsRemindersController } from './user-settings-reminders.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserSettingsRemindersEntity])],
  controllers: [UserSettingsRemindersController],
  providers: [UserSettingsRemindersCrudService, UserSettingsRemindersService],
  exports: [UserSettingsRemindersCrudService, UserSettingsRemindersService],
})
export class UserSettingsRemindersModule {}
