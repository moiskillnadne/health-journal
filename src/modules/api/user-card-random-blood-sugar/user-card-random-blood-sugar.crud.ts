import { FindOneOptions, FindManyOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardRandomBloodSugarHistoryEntity } from '../../../database/entities/user-card-random-blood-sugar-history.entity'

import { UserCardRandomBloodSugarQueryParamsDto } from './dto/user-card-random-blood-sugar.dto'
import { GetUserRandomBloodSugarResponseDto } from './dto/user-card-random-blood-sugar.response.dto'

@Injectable()
export class UserCardRandomBloodSugarCrudService {
  constructor(
    @InjectRepository(UserCardRandomBloodSugarHistoryEntity)
    protected userCardRandomBloodSugarHistoryRepository: Repository<UserCardRandomBloodSugarHistoryEntity>,
  ) {}

  async getUserRandomBloodSugarByParams(
    id: string,
    params: UserCardRandomBloodSugarQueryParamsDto,
  ): Promise<GetUserRandomBloodSugarResponseDto[]> {
    const queryBuilder = this.userCardRandomBloodSugarHistoryRepository.createQueryBuilder()

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

  async getUserRandomBloodSugarByCardId(
    id: string,
    params: FindManyOptions<UserCardRandomBloodSugarHistoryEntity>,
  ): Promise<UserCardRandomBloodSugarHistoryEntity[]> {
    return this.userCardRandomBloodSugarHistoryRepository.find({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async getUserRandomBloodSugarByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardRandomBloodSugarHistoryEntity>,
  ): Promise<UserCardRandomBloodSugarHistoryEntity> {
    return this.userCardRandomBloodSugarHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserRandomBloodSugarByCardId(
    id: string,
    params: Partial<UserCardRandomBloodSugarHistoryEntity>,
  ): Promise<UserCardRandomBloodSugarHistoryEntity> {
    return this.userCardRandomBloodSugarHistoryRepository.save({ cardId: id, ...params })
  }
}
