import { FindManyOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserConditionsEntity } from '../../../database/entities/user-conditions.entity'

import { PaginationOptionsDTO } from '../../../core/dtos/pagination'

@Injectable()
export class UserConditionsCrudService {
  constructor(
    @InjectRepository(UserConditionsEntity)
    protected userConditionsRepository: Repository<UserConditionsEntity>,
  ) {}

  async getUserConditionsByUserId(userId: string, params: FindManyOptions<UserConditionsEntity> = {}) {
    return this.userConditionsRepository.find({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  async getUserConditionsByParams(
    id: string,
    params: FindManyOptions<UserConditionsEntity>,
    paginationParams?: PaginationOptionsDTO,
  ): Promise<{ entities: UserConditionsEntity[]; totalCount: number }> {
    const queryBuilder = this.userConditionsRepository.createQueryBuilder('uc')

    queryBuilder.leftJoinAndSelect('uc.condition', 'c')

    queryBuilder
      .select(['uc.id', 'uc.info', 'uc.status', 'uc.conditionResolvedDate', 'uc.createAt', 'c.name'])
      .where('uc.userId = :id', { id })
      .orderBy(`uc.createAt`, Order.DESC)

    if (params.where['status']) {
      queryBuilder.andWhere('uc.status = :status', { status: params.where['status'] })
    }

    const totalCount = await queryBuilder.getCount()

    if (paginationParams?.page && paginationParams?.take) {
      queryBuilder.skip((paginationParams.page - 1) * paginationParams.take)
      queryBuilder.take(paginationParams.take)
    }

    const entities = await queryBuilder.getMany()

    return { entities, totalCount }
  }

  async addUserConditionsByParams(params: Partial<UserConditionsEntity>[]): Promise<UserConditionsEntity[]> {
    return this.userConditionsRepository.save(params)
  }

  async updateByConditionId(id: string, params: Partial<UserConditionsEntity>) {
    return this.userConditionsRepository.update({ id }, params)
  }
}
