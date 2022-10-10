import { FindManyOptions, FindOptionsWhere, In } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { NotificationType } from '../../../constants/enums/notifications.constants'
import { ProcedureToNotificationExpireType } from '../../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../../database/entities/user-reminders.entity'

import { NotificationPredefinedCrud } from '../admin/notification/crud/notification-predefined.crud'
import { ProceduresCrudService } from '../procedures/procedures.crud'

import { UserRemindersCrudService } from './user-reminders.crud'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'

@Injectable()
export class UserRemindersService {
  constructor(
    private userRemindersCrudService: UserRemindersCrudService,
    private notificationPredefinedCrudService: NotificationPredefinedCrud,
    private proceduresCrudService: ProceduresCrudService,
  ) {}

  public async getUserRemindersByNotificationTypes(
    types: NotificationType[],
    params: FindManyOptions<UserRemindersEntity> = {},
  ) {
    return this.userRemindersCrudService.getUserRemindersByParams({
      ...params,
      relations: {
        ...params.relations,
        notification: {
          procedure: true,
        },
      },
      where: {
        ...params.where,
        notification: {
          type: In(types),
          isPublished: true,
        },
      },
    })
  }

  public async upsertUserRemindersByType(userId: string[], type: NotificationType) {
    const notification = await this.notificationPredefinedCrudService.getPredefinedNotificationByType(type)
    const reminders = await Promise.all(
      userId.map((id) =>
        this.userRemindersCrudService.getUserRemindersByParams({
          where: { userId: id, notification: { type } },
        }),
      ),
    )

    const promises = reminders.map((reminder, index) =>
      this.upsertUserRemindersByParams(reminder, {
        userId: userId[index],
        notificationId: notification.id,
      }),
    )

    return Promise.all(promises)
  }

  public async upsertUserRemindersByParams(reminders: UserRemindersEntity[], params: Partial<UserRemindersEntity>) {
    if (reminders.length) {
      return this.userRemindersCrudService.updateUserReminderById(
        reminders.map((reminder) => reminder.id),
        { period: null, interval: null, lastExecuteAt: new Date() },
      )
    }

    return this.userRemindersCrudService.addUserReminderByParams(params)
  }

  public async addUserReminderByParams(params: Partial<UserRemindersEntity>) {
    return this.userRemindersCrudService.addUserReminderByParams(params)
  }

  public async addUserReminderByNotificationType(type: NotificationType, params: Partial<UserRemindersEntity>) {
    const notification = await this.notificationPredefinedCrudService.getPredefinedNotificationByType(type)

    if (!notification) {
      throw new InternalServerError(DictionaryErrorMessages.InternalServerError)
    }

    return this.userRemindersCrudService.addUserReminderByParams({
      notificationId: notification?.id,
      ...params,
    })
  }

  public async addUserReminderByProcedureId(id: string, params: Partial<UserRemindersEntity>) {
    const procedure = await this.proceduresCrudService.getProcedureById(id)
    const notification = await this.notificationPredefinedCrudService.getPredefinedNotificationByType(
      ProcedureToNotificationExpireType[procedure.tag],
    )

    return this.userRemindersCrudService.addUserReminderByParams({
      notificationId: notification.id,
      ...params,
    })
  }

  public async updateUserReminderById(id: string | string[], params: Partial<UserRemindersEntity>) {
    return this.userRemindersCrudService.updateUserReminderById(id, params)
  }

  public async deleteUserReminderByNotificationType(
    type: NotificationType,
    params: FindOptionsWhere<UserRemindersEntity>,
  ) {
    const notification = await this.notificationPredefinedCrudService.getPredefinedNotificationByType(type)

    return this.userRemindersCrudService.deleteUserRemindersByParams({
      notificationId: notification.id,
      ...params,
    })
  }

  public async deleteUserReminderById(id: string) {
    return this.userRemindersCrudService.deleteUserReminderById(id)
  }

  public upsertReminder(userId: string, notificationId: string, params: Partial<UserRemindersEntity>) {
    return this.userRemindersCrudService.upsert({ ...params, userId, notificationId }, ['userId', 'notificationId'])
  }
}
