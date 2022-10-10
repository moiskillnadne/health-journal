import { Repository, In } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Procedure } from '../../../constants/enums/procedures.constants'

import { ProceduresEntity } from '../../../database/entities/procedures.entity'

@Injectable()
export class ProceduresCrudService {
  constructor(
    @InjectRepository(ProceduresEntity)
    protected proceduresRepository: Repository<ProceduresEntity>,
  ) {}

  async getProceduresList(): Promise<ProceduresEntity[]> {
    return this.proceduresRepository.find()
  }

  async getProcedureById(id: string): Promise<ProceduresEntity> {
    return this.proceduresRepository.findOne({ where: { id } })
  }

  async getProcedureByTag(tag: Procedure): Promise<ProceduresEntity> {
    return this.proceduresRepository.findOne({ where: { tag } })
  }

  async getProceduresByTagList(tags: string[]): Promise<ProceduresEntity[]> {
    return this.proceduresRepository.find({
      where: {
        tag: In(tags),
      },
    })
  }
}
