import { FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserCardTriglycerideLevelHistoryEntity } from '../../../database/entities/user-card-triglyceride-level-history.entity'
import { UserCardTriglycerideLevelPeriodParamsDto } from './dto/user-card-triglyceride-level.dto'
import { Order } from '../../../constants/enums/pagination.constants'
import { GetUserTriglycerideResponseDto } from './dto/user-card-triglyceride-level.response.dto'

@Injectable()
export class UserCardTriglycerideLevelCrudService {
  constructor(
    @InjectRepository(UserCardTriglycerideLevelHistoryEntity)
    protected userCardTriglycerideLevelHistoryRepository: Repository<UserCardTriglycerideLevelHistoryEntity>,
  ) {}

  async getUserCardTriglycerideLevelByParams(
    cardId: string,
    params: UserCardTriglycerideLevelPeriodParamsDto,
  ): Promise<GetUserTriglycerideResponseDto[]> {
    const queryBuilder = this.userCardTriglycerideLevelHistoryRepository.createQueryBuilder()

    queryBuilder
      .select(`json_build_object('mgDl', "triglycerideMgDl", 'mmolL', "triglycerideMmolL")`, 'value')
      .addSelect('datetime')
      .where('"cardId" = :cardId', { cardId })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    return queryBuilder.getRawMany()
  }

  async getUserTriglycerideLevelByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardTriglycerideLevelHistoryEntity>,
  ): Promise<UserCardTriglycerideLevelHistoryEntity> {
    return this.userCardTriglycerideLevelHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserTriglycerideLevelByCardId(
    id: string,
    params: Partial<UserCardTriglycerideLevelHistoryEntity>,
  ): Promise<UserCardTriglycerideLevelHistoryEntity> {
    return this.userCardTriglycerideLevelHistoryRepository.save({ cardId: id, ...params })
  }
}
