import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { GenderEntity } from '../../../database/entities/gender.entity'

@Injectable()
export class GenderCrudService {
  constructor(
    @InjectRepository(GenderEntity)
    protected genderRepository: Repository<GenderEntity>,
  ) {}

  async getGenderList(): Promise<GenderEntity[]> {
    return this.genderRepository.find()
  }
}
