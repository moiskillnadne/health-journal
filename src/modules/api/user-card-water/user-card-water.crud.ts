import { UserCardWaterHistoryEntity } from '../../../database/entities/user-card-water.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { Order } from '../../../constants/enums/pagination.constants'

@Injectable()
export class UserCardWaterCrudService {
  constructor(
    @InjectRepository(UserCardWaterHistoryEntity)
    private userCardWaterRepository: Repository<UserCardWaterHistoryEntity>,
  ) {}

  public async getTodaysWaterRecordsById(cardId: string): Promise<UserCardWaterHistoryEntity[]> {
    const qb = this.userCardWaterRepository.createQueryBuilder('water')

    qb.select(["DATE_TRUNC('day', datetime) as date", 'SUM("waterMl") as "waterMl"', 'SUM("waterFloz") as "waterFloz"'])

    qb.where('water.cardId = :cardId', { cardId })
    qb.andWhere("DATE(DATE_TRUNC('day', datetime)) >= CURRENT_DATE")
    qb.andWhere("DATE(DATE_TRUNC('day', datetime)) < CURRENT_DATE + INTERVAL '1 DAY'")

    qb.groupBy("DATE_TRUNC('day', datetime)")
    qb.orderBy("DATE_TRUNC('day', datetime)", Order.DESC)

    return qb.execute()
  }

  public getWaterRecordByIdWithParams(
    cardId: string,
    params: FindOneOptions<UserCardWaterHistoryEntity>,
  ): Promise<UserCardWaterHistoryEntity> {
    return this.userCardWaterRepository.findOne({
      ...params,
      where: {
        cardId,
        ...params.where,
      },
    })
  }

  public insertWaterValue(cardId: string, params: Partial<UserCardWaterHistoryEntity>) {
    return this.userCardWaterRepository.save({ cardId, ...params })
  }

  public updateWaterValueById(recordId: string, params: Partial<UserCardWaterHistoryEntity>) {
    return this.userCardWaterRepository.update({ id: recordId }, { ...params })
  }
}
