import { FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardHba1cHistoryEntity } from '../../../database/entities/user-card-hba1c-history.entity'

import { UserCardHba1cQueryParamsDto } from './dto/user-card-hba1c.dto'
import { GetUserHba1cResponseDto } from './dto/user-card-hba1c.response.dto'

@Injectable()
export class UserCardHba1cCrudService {
  constructor(
    @InjectRepository(UserCardHba1cHistoryEntity)
    protected userCardHba1cHistoryRepository: Repository<UserCardHba1cHistoryEntity>,
  ) {}

  async getUserHba1cByParams(id: string, params: UserCardHba1cQueryParamsDto): Promise<GetUserHba1cResponseDto[]> {
    const queryBuilder = this.userCardHba1cHistoryRepository.createQueryBuilder()

    queryBuilder
      .select(`json_build_object('percent', "percent")`, 'value')
      .addSelect('datetime')
      .where('"cardId" = :id', { id })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    return queryBuilder.getRawMany()
  }

  async getUserHba1cByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardHba1cHistoryEntity>,
  ): Promise<UserCardHba1cHistoryEntity> {
    return this.userCardHba1cHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserHba1cByCardId(
    id: string,
    params: Partial<UserCardHba1cHistoryEntity>,
  ): Promise<UserCardHba1cHistoryEntity> {
    return this.userCardHba1cHistoryRepository.save({ cardId: id, ...params })
  }
}
