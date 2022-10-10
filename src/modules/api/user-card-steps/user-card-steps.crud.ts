import { FindOneOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'
import { PageDTO, PageMetaDTO } from '../../../core/dtos/pagination'

import { UserCardStepsHistoryEntity } from '../../../database/entities/user-card-steps-history.entity'

import { UserCardStepsQueryParamsDto } from './dto/user-card-steps.dto'
import { GetUserStepsResponseDto } from './dto/user-card-steps.response.dto'

@Injectable()
export class UserCardStepsCrudService {
  constructor(
    @InjectRepository(UserCardStepsHistoryEntity)
    protected userCardStepsHistoryRepository: Repository<UserCardStepsHistoryEntity>,
  ) {}

  async getUserStepsByParams(
    cardId: string,
    params: UserCardStepsQueryParamsDto,
  ): Promise<PageDTO<GetUserStepsResponseDto>> {
    const queryBuilder = this.userCardStepsHistoryRepository.createQueryBuilder()

    queryBuilder
      .select('steps')
      .addSelect('datetime')
      .where('"cardId" = :cardId', { cardId })
      .orderBy('datetime', Order.DESC)
      .addOrderBy('"createAt"', Order.DESC)
      .skip((params.page - 1) * params.take)
      .take(params.take)

    if (params.period) {
      queryBuilder.andWhere(`datetime >= current_date - interval '1 ${params.period}'`)
    }

    const count = await queryBuilder.getCount()
    const entities = await queryBuilder.getRawMany()

    return new PageDTO(
      entities,
      new PageMetaDTO({ paginationOptionsDto: { ...params, order: `datetime ${Order.DESC}` }, itemCount: count }),
    )
  }

  async getUserStepsRecordByParams(
    cardId: string,
    params: FindOneOptions<UserCardStepsHistoryEntity>,
  ): Promise<UserCardStepsHistoryEntity> {
    return this.userCardStepsHistoryRepository.findOne({
      ...params,
      where: {
        cardId,
        ...params.where,
      },
    })
  }

  async addUserStepsByParams(
    cardId: string,
    params: Partial<UserCardStepsHistoryEntity>,
  ): Promise<UserCardStepsHistoryEntity> {
    return this.userCardStepsHistoryRepository.save({ cardId, ...params })
  }
}
