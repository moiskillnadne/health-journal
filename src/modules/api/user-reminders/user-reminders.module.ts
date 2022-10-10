import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserRemindersEntity } from '../../../database/entities/user-reminders.entity'
import { NotificationPredefinedEntity } from '../../../database/entities/notification-predefined.entity'

import { ProceduresModule } from '../procedures/procedures.module'

import { NotificationPredefinedCrud } from '../admin/notification/crud/notification-predefined.crud'

import { UserRemindersCrudService } from './user-reminders.crud'
import { UserRemindersService } from './user-reminders.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRemindersEntity, NotificationPredefinedEntity]), ProceduresModule],
  providers: [UserRemindersService, UserRemindersCrudService, NotificationPredefinedCrud],
  exports: [UserRemindersService, UserRemindersCrudService],
})
export class UserRemindersModule {}
