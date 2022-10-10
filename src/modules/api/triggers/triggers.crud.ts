import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TriggersEntity } from '../../../database/entities/triggers.entity'

@Injectable()
export class TriggersCrudService {
  constructor(
    @InjectRepository(TriggersEntity)
    protected triggersEntityRepository: Repository<TriggersEntity>,
  ) {}

  getTriggersList(): Promise<TriggersEntity[]> {
    return this.triggersEntityRepository.find()
  }

  getTriggersByIds(ids: string[]): Promise<TriggersEntity[]> {
    return this.triggersEntityRepository.findBy({ id: In(ids) })
  }
}
