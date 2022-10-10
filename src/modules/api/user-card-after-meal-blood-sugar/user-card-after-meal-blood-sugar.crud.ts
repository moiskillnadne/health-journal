import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardAfterMealBloodSugarHistoryEntity } from '../../../database/entities/user-card-after-meal-blood-sugar-history.entity'

import { UserCardAfterMealBloodSugarQueryParamsDto } from './dto/user-card-after-meal-blood-sugar.dto'
import { GetUserAfterMealBloodSugarResponseDto } from './dto/user-card-after-meal-blood-sugar.response.dto'

@Injectable()
export class UserCardAfterMealBloodSugarCrudService {
  constructor(
    @InjectRepository(UserCardAfterMealBloodSugarHistoryEntity)
    protected userCardAfterMealBloodSugarHistoryRepository: Repository<UserCardAfterMealBloodSugarHistoryEntity>,
  ) {}

  async getUserAfterMealBloodSugarByParams(
    id: string,
    params: UserCardAfterMealBloodSugarQueryParamsDto,
  ): Promise<GetUserAfterMealBloodSugarResponseDto[]> {
    const queryBuilder = this.userCardAfterMealBloodSugarHistoryRepository.createQueryBuilder()

    queryBuilder
      .select(`json_build_object('mgDl', "sugarMgDl", 'mmolL', "sugarMmolL")`, 'value')
      .addSelect('datetime')
      .where('"cardId" = :id', { id })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    return queryBuilder.getRawMany()
  }

  async getUserAfterMealBloodSugarByCardId(
    id: string,
    params: FindManyOptions<UserCardAfterMealBloodSugarHistoryEntity>,
  ): Promise<UserCardAfterMealBloodSugarHistoryEntity[]> {
    return this.userCardAfterMealBloodSugarHistoryRepository.find({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async getUserAfterMealBloodSugarByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardAfterMealBloodSugarHistoryEntity>,
  ): Promise<UserCardAfterMealBloodSugarHistoryEntity> {
    return this.userCardAfterMealBloodSugarHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserAfterMealBloodSugarByCardId(
    id: string,
    params: Partial<UserCardAfterMealBloodSugarHistoryEntity>,
  ): Promise<UserCardAfterMealBloodSugarHistoryEntity> {
    return this.userCardAfterMealBloodSugarHistoryRepository.save({ cardId: id, ...params })
  }
}
