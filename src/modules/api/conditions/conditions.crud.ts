import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ConditionsEntity } from '../../../database/entities/conditions.entity'
import { Order } from '../../../constants/enums/pagination.constants'

@Injectable()
export class ConditionsCrudService {
  constructor(
    @InjectRepository(ConditionsEntity)
    protected conditionsRepository: Repository<ConditionsEntity>,
  ) {}

  async getConditionsList(): Promise<ConditionsEntity[]> {
    return this.conditionsRepository.find({
      order: {
        order: Order.ASC,
      },
    })
  }

  async getConditionsByIds(conditionsIds: string[]): Promise<ConditionsEntity[]> {
    return this.conditionsRepository.findBy({ id: In(conditionsIds) })
  }
}
