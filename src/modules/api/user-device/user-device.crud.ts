import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserDeviceEntity } from '../../../database/entities/user-dervice.entity'

@Injectable()
export class UserDeviceCrudService {
  constructor(@InjectRepository(UserDeviceEntity) private userDeviceRepo: Repository<UserDeviceEntity>) {}

  public getDevicesByUserIdsWithParams(
    userIds: string[],
    params: FindManyOptions<UserDeviceEntity> = {},
  ): Promise<UserDeviceEntity[]> {
    return this.userDeviceRepo.find({ ...params, where: { userId: In(userIds), ...params.where } })
  }

  public async isDeviceTokenExist(fcmToken: string): Promise<boolean> {
    return (await this.userDeviceRepo.countBy({ fcmToken })) > 0
  }

  public saveUserDeviceByUserId(userId: string, fcmToken: string) {
    return this.userDeviceRepo.save({ userId, fcmToken })
  }

  public removeUserDevicesByParams(params: FindOptionsWhere<UserDeviceEntity>) {
    return this.userDeviceRepo.delete(params)
  }

  public removeDevicesByTokens(fcmTokens: string[]) {
    return this.userDeviceRepo.delete({ fcmToken: In(fcmTokens) })
  }
}
