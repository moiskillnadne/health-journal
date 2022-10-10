import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { RaceEntity } from '../../../database/entities/race.entity'

@Injectable()
export class RaceCrudService {
  constructor(
    @InjectRepository(RaceEntity)
    protected raceRepository: Repository<RaceEntity>,
  ) {}

  async getRaceList(): Promise<RaceEntity[]> {
    return this.raceRepository.find()
  }
}
