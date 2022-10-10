import { UserSettingsNotificationsEntity } from '../../../database/entities/user-settings-notifications.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationsDTO } from './user-settings-notifications.dto'

@Injectable()
export class UserSettingsNotificationsCrudService {
  constructor(
    @InjectRepository(UserSettingsNotificationsEntity)
    private userSettingsNotificationsRepository: Repository<UserSettingsNotificationsEntity>,
  ) {}

  public getNotificationsById(id: string): Promise<UserSettingsNotificationsEntity | null> {
    return this.userSettingsNotificationsRepository.findOne({ where: { id } })
  }

  public getNotificationsByUserId(id: string): Promise<UserSettingsNotificationsEntity | null> {
    return this.userSettingsNotificationsRepository.findOne({ where: { user: { id } } })
  }

  public createInititalNotifications(
    userId: string,
    fields?: NotificationsDTO,
  ): Promise<UserSettingsNotificationsEntity> {
    if (fields) {
      return this.userSettingsNotificationsRepository.save({ user: { id: userId }, ...fields })
    }

    return this.userSettingsNotificationsRepository.save({ user: { id: userId } })
  }

  public async upsertNotificationByUserId(
    id: string,
    fields: NotificationsDTO,
  ): Promise<UserSettingsNotificationsEntity> {
    const notifications = await this.getNotificationsByUserId(id)

    if (notifications) {
      await this.userSettingsNotificationsRepository.update(notifications.id, { ...fields })
      return this.getNotificationsByUserId(id)
    }

    return this.userSettingsNotificationsRepository.save({ user: { id }, ...fields })
  }

  public async updateNotificationByUserId(id: string, params: Partial<UserSettingsNotificationsEntity>) {
    return this.userSettingsNotificationsRepository.update({ userId: id }, params)
  }
}
