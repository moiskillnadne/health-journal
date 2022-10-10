import { FindManyOptions, Repository, DeleteResult, In } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserTargetGroupsEntity } from '../../../database/entities/user-target-groups.entity'

@Injectable()
export class UserTargetGroupsCrudService {
  constructor(
    @InjectRepository(UserTargetGroupsEntity)
    protected userTargetGroupsRepository: Repository<UserTargetGroupsEntity>,
  ) {}

  async getUserTargetGroupsByUserId(userId: string, params: FindManyOptions<UserTargetGroupsEntity> = {}) {
    return this.userTargetGroupsRepository.find({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  async getUsersByTargetGroupIds(targetGroupIds: string[]) {
    return this.userTargetGroupsRepository.find({
      where: {
        targetGroupId: In(targetGroupIds),
      },
    })
  }

  async addUserTargetGroupByUserId(userId: string, targetGroupId: string): Promise<UserTargetGroupsEntity> {
    return this.userTargetGroupsRepository.save({ userId, targetGroupId })
  }

  async deleteUserTargetGroupByUserId(userId: string, targetGroupId: string): Promise<DeleteResult> {
    return this.userTargetGroupsRepository.delete({ userId, targetGroupId })
  }
}
