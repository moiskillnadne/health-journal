import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Order } from '../../../constants/enums/pagination.constants'

import { UserCardEntity } from '../../../database/entities/user-card.entity'

import { GetUserLastBmiResponseDto } from './dto/user-card-bmi.response.dto'

@Injectable()
export class UserCardBmiCrudService {
  constructor(
    @InjectRepository(UserCardEntity)
    protected userCardRepository: Repository<UserCardEntity>,
  ) {}

  async getUserLastBmiByUserId(userId: string): Promise<GetUserLastBmiResponseDto> {
    const queryBuilder = this.userCardRepository.createQueryBuilder('uc')

    queryBuilder
      .select(
        `(
        CASE 
          WHEN w.weightKg > 0 AND uc.heightCm > 0 THEN round((w.weightKg / POW(uc.heightCm / 100, 2))::numeric, 2)
          ELSE 0
        END
      )`,
        'bmi',
      )
      .leftJoin('uc.weight', 'w')
      .where('uc.userId = :userId', { userId })
      .orderBy('w.datetime', Order.DESC)

    return queryBuilder.getRawOne()
  }
}
