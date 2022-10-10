import { FindOptionsWhere, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserProceduresEntity } from '../../../database/entities/user-procedures.entity'

@Injectable()
export class UserProceduresCrudService {
  constructor(
    @InjectRepository(UserProceduresEntity)
    protected userProceduresRepository: Repository<UserProceduresEntity>,
  ) {}

  async getUserProcedureById(id: string) {
    return this.userProceduresRepository.findOne({
      relations: {
        reminder: true,
      },
      where: { id },
    })
  }

  async getUserProceduresByUserId(userId: string) {
    return this.userProceduresRepository.find({
      select: {
        userId: true,
        procedureId: true,
        datetime: true,
      },
      where: {
        userId,
      },
    })
  }

  async getUserProceduresByParams(where: FindOptionsWhere<UserProceduresEntity>) {
    return this.userProceduresRepository.find({
      relations: {
        procedure: true,
      },
      where,
    })
  }

  async addUserProcedureByParams(params: Partial<UserProceduresEntity>) {
    return this.userProceduresRepository.save(params)
  }

  async updateUserProcedureById(id: string, params: Partial<UserProceduresEntity>) {
    return this.userProceduresRepository.update(id, params)
  }

  async updateUserProceduresByParams(
    where: FindOptionsWhere<UserProceduresEntity>,
    params: Partial<UserProceduresEntity>,
  ) {
    return this.userProceduresRepository.update(where, params)
  }

  async deleteUserProcedureById(id: string) {
    return this.userProceduresRepository.delete(id)
  }
}
