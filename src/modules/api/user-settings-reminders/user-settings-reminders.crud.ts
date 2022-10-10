import { FindOneOptions, Repository, InsertResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserSettingsRemindersEntity } from '../../../database/entities/user-settings-reminders.entity'

@Injectable()
export class UserSettingsRemindersCrudService {
  constructor(
    @InjectRepository(UserSettingsRemindersEntity)
    protected userSettingsRemindersRepository: Repository<UserSettingsRemindersEntity>,
  ) {}

  async getUserSettingsRemindersByParams(
    userId: string,
    params: FindOneOptions<UserSettingsRemindersEntity> = {},
  ): Promise<UserSettingsRemindersEntity> {
    return this.userSettingsRemindersRepository.findOne({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  async saveUserSettingsRemindersByParams(
    userId: string,
    params: Partial<UserSettingsRemindersEntity>,
  ): Promise<InsertResult> {
    return this.userSettingsRemindersRepository.upsert(
      { userId, ...params },
      {
        skipUpdateIfNoValuesChanged: true,
        conflictPaths: ['userId'],
      },
    )
  }
}
