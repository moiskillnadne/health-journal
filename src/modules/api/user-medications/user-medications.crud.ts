import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserMedicationsEntity } from '../../../database/entities/user-medications.entity'

@Injectable()
export class UserMedicationsCrudService {
  constructor(
    @InjectRepository(UserMedicationsEntity)
    protected userMedicationsRepository: Repository<UserMedicationsEntity>,
  ) {}

  async getUserMedicationById(id: string) {
    return this.userMedicationsRepository.findOne({ where: { id } })
  }

  async getUserMedicationsByUserId(userId: string, params: FindManyOptions<UserMedicationsEntity> = {}) {
    return this.userMedicationsRepository.find({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  async getUserMedicationsByParams(where: FindOptionsWhere<UserMedicationsEntity>) {
    return this.userMedicationsRepository.find({
      select: {
        id: true,
        medicationProductId: true,
        frequency: true,
        period: true,
        amount: true,
        currency: true,
        status: true,
        statusUpdated: true,
      },
      relations: {
        medication: true,
      },
      where,
    })
  }

  async addUserMedicationsByParams(params: Partial<UserMedicationsEntity>[]): Promise<UserMedicationsEntity[]> {
    return this.userMedicationsRepository.save(params)
  }

  async updateUserMedicationById(id: string, params: Partial<UserMedicationsEntity>) {
    return this.userMedicationsRepository.update(id, params)
  }

  async deleteUserMedicationById(id: string) {
    return this.userMedicationsRepository.delete(id)
  }
}
