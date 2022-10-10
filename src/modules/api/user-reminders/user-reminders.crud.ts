import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserRemindersEntity } from '../../../database/entities/user-reminders.entity'

@Injectable()
export class UserRemindersCrudService {
  constructor(
    @InjectRepository(UserRemindersEntity)
    protected userRemindersRepository: Repository<UserRemindersEntity>,
  ) {}

  async getUserRemindersByParams(params: FindManyOptions<UserRemindersEntity>) {
    return this.userRemindersRepository.find({
      ...params,
      relations: {
        notification: true,
        ...params.relations,
      },
    })
  }

  async addUserReminderByParams(params: Partial<UserRemindersEntity>) {
    return this.userRemindersRepository.save(params)
  }

  async updateUserReminderById(id: string | string[], params: Partial<UserRemindersEntity>) {
    return this.userRemindersRepository.update(id, params)
  }

  async deleteUserRemindersByParams(params: FindOptionsWhere<UserRemindersEntity>) {
    return this.userRemindersRepository.delete(params)
  }

  async deleteUserReminderById(id: string) {
    return this.userRemindersRepository.delete(id)
  }

  upsert(params: Partial<UserRemindersEntity>, conflictPaths: Array<keyof UserRemindersEntity>) {
    return this.userRemindersRepository.upsert(params, {
      conflictPaths: conflictPaths,
      skipUpdateIfNoValuesChanged: true,
    })
  }
}
