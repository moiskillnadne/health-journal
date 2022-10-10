import { FindOneOptions, FindManyOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardFastingBloodSugarHistoryEntity } from '../../../database/entities/user-card-fasting-blood-sugar-history.entity'

import { UserCardFastingBloodSugarQueryParamsDto } from './dto/user-card-fasting-blood-sugar.dto'
import { GetUserFastingBloodSugarResponseDto } from './dto/user-card-fasting-blood-sugar.response.dto'

@Injectable()
export class UserCardFastingBloodSugarCrudService {
  constructor(
    @InjectRepository(UserCardFastingBloodSugarHistoryEntity)
    protected userCardFastingBloodSugarHistoryRepository: Repository<UserCardFastingBloodSugarHistoryEntity>,
  ) {}

  async getUserFastingBloodSugarByParams(
    id: string,
    params: UserCardFastingBloodSugarQueryParamsDto,
  ): Promise<GetUserFastingBloodSugarResponseDto[]> {
    const queryBuilder = this.userCardFastingBloodSugarHistoryRepository.createQueryBuilder()

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

  async getUserFastingBloodSugarByCardId(
    id: string,
    params: FindManyOptions<UserCardFastingBloodSugarHistoryEntity>,
  ): Promise<UserCardFastingBloodSugarHistoryEntity[]> {
    return this.userCardFastingBloodSugarHistoryRepository.find({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async getUserFastingBloodSugarByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardFastingBloodSugarHistoryEntity>,
  ): Promise<UserCardFastingBloodSugarHistoryEntity> {
    return this.userCardFastingBloodSugarHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserFastingBloodSugarByCardId(
    id: string,
    params: Partial<UserCardFastingBloodSugarHistoryEntity>,
  ): Promise<UserCardFastingBloodSugarHistoryEntity> {
    return this.userCardFastingBloodSugarHistoryRepository.save({ cardId: id, ...params })
  }
}
