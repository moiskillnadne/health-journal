import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardBloodPressureHistoryEntity } from '../../../database/entities/user-card-blood-pressure-history.entity'

import { UserCardBloodPressureQueryParamsDto } from './dto/user-card-blood-pressure.dto'
import { GetUserBloodPressureResponseDto } from './dto/user-card-blood-pressure.response.dto'

@Injectable()
export class UserCardBloodPressureCrudService {
  constructor(
    @InjectRepository(UserCardBloodPressureHistoryEntity)
    protected userCardBloodPressureHistoryRepository: Repository<UserCardBloodPressureHistoryEntity>,
  ) {}

  async getUserBloodPressureByParams(
    id: string,
    params: UserCardBloodPressureQueryParamsDto,
  ): Promise<GetUserBloodPressureResponseDto[]> {
    const queryBuilder = this.userCardBloodPressureHistoryRepository.createQueryBuilder()

    queryBuilder
      .select(`json_build_object('systolic', "pressureSystolicMmHg", 'diastolic', "pressureDiastolicMmHg")`, 'value')
      .addSelect('datetime')
      .where('"cardId" = :id', { id })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    return queryBuilder.getRawMany()
  }

  async getUserBloodPressureByCardIdWithParams(
    id: string,
    params: FindOneOptions<UserCardBloodPressureHistoryEntity>,
  ): Promise<UserCardBloodPressureHistoryEntity> {
    return this.userCardBloodPressureHistoryRepository.findOne({
      ...params,
      where: {
        cardId: id,
        ...params.where,
      },
    })
  }

  async getUserBloodPressureByCardId(
    cardId: string,
    params: FindManyOptions<UserCardBloodPressureHistoryEntity>,
  ): Promise<UserCardBloodPressureHistoryEntity[]> {
    return this.userCardBloodPressureHistoryRepository.find({
      where: { cardId },
      ...params,
    })
  }

  async addUserBloodPressureByCardId(
    id: string,
    params: Partial<UserCardBloodPressureHistoryEntity>,
  ): Promise<UserCardBloodPressureHistoryEntity> {
    return this.userCardBloodPressureHistoryRepository.save({ cardId: id, ...params })
  }
}
