import { FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardWeightHistoryEntity } from '../../../database/entities/user-card-weight-history.entity'

import { UserCardWeightHistoryQueryParamsDto } from './dto/user-card-weight.dto'
import { GetUserWeightHistoryResponseDto } from './dto/user-card-weight.response.dto'

@Injectable()
export class UserCardWeightCrudService {
  constructor(
    @InjectRepository(UserCardWeightHistoryEntity)
    protected userCardWeightHistoryRepository: Repository<UserCardWeightHistoryEntity>,
  ) {}

  async getUserWeightHistoryByParams(
    id: string,
    params: UserCardWeightHistoryQueryParamsDto,
  ): Promise<GetUserWeightHistoryResponseDto[]> {
    const queryBuilder = this.userCardWeightHistoryRepository.createQueryBuilder()

    queryBuilder
      .select(`json_build_object('lb', "weightLb", 'kg', "weightKg")`, 'value')
      .addSelect('datetime')
      .where('"cardId" = :id', { id })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    return queryBuilder.getRawMany()
  }

  async getUserWeightRecordByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardWeightHistoryEntity> = {},
  ): Promise<UserCardWeightHistoryEntity> {
    return this.userCardWeightHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async addUserWeightByCardId(
    id: string,
    params: Partial<UserCardWeightHistoryEntity>,
  ): Promise<UserCardWeightHistoryEntity> {
    return this.userCardWeightHistoryRepository.save({ cardId: id, ...params })
  }

  public async upsertUserWeightByCardId(id: string, params: Partial<UserCardWeightHistoryEntity>) {
    const weight = await this.getUserWeightRecordByCardIdWithParams(id)

    if (weight) {
      return this.userCardWeightHistoryRepository.update(weight.id, params)
    }

    return this.userCardWeightHistoryRepository.save({ cardId: id, ...params })
  }
}
