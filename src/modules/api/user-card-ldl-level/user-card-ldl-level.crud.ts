import { FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserCardLdlLevelHistoryEntity } from '../../../database/entities/user-card-ldl-level-history.entity'
import { UserCardLdlLevelQueryParamsDto } from './dto/user-card-ldl-level.dto'
import { Order } from '../../../constants/enums/pagination.constants'
import { GetUserLdlLevelResponseDto } from './dto/user-card-ldl-level.response.dto'

@Injectable()
export class UserCardLdlLevelCrudService {
  constructor(
    @InjectRepository(UserCardLdlLevelHistoryEntity)
    protected userCardLdlLevelHistoryRepository: Repository<UserCardLdlLevelHistoryEntity>,
  ) {}

  async getLdlLevelByParams(
    cardId: string,
    params: UserCardLdlLevelQueryParamsDto,
  ): Promise<GetUserLdlLevelResponseDto[]> {
    const queryBuilder = this.userCardLdlLevelHistoryRepository.createQueryBuilder()

    queryBuilder
      .select(`json_build_object('mgDl', "ldlMgDl", 'mmolL', "ldlMmolL")`, 'value')
      .addSelect('datetime')
      .where('"cardId" = :cardId', { cardId })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    return queryBuilder.getRawMany()
  }

  async getUserLdlLevelByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardLdlLevelHistoryEntity>,
  ): Promise<UserCardLdlLevelHistoryEntity> {
    return this.userCardLdlLevelHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserLdlLevelByCardId(
    id: string,
    params: Partial<UserCardLdlLevelHistoryEntity>,
  ): Promise<UserCardLdlLevelHistoryEntity> {
    return this.userCardLdlLevelHistoryRepository.save({ cardId: id, ...params })
  }
}
