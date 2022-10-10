import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { UserCardSleepHistoryEntity } from '../../../database/entities/user-card-sleep-history.entity'

@Injectable()
export class UserCardSleepCrudService {
  constructor(
    @InjectRepository(UserCardSleepHistoryEntity)
    protected userCardSleepHistoryRepository: Repository<UserCardSleepHistoryEntity>,
  ) {}

  public getOneRecordByIdWithParams(cardId: string, params: FindOneOptions<UserCardSleepHistoryEntity>) {
    return this.userCardSleepHistoryRepository.findOne({
      ...params,
      where: {
        cardId,
        ...params.where,
      },
    })
  }

  public getAllRecords(cardId: string, params: FindOneOptions<UserCardSleepHistoryEntity>) {
    return this.userCardSleepHistoryRepository.find({
      ...params,
      where: {
        cardId,
        ...params.where,
      },
    })
  }

  public saveRecord(cardId: string, params: Partial<UserCardSleepHistoryEntity>) {
    return this.userCardSleepHistoryRepository.save({ cardId, ...params })
  }
}
