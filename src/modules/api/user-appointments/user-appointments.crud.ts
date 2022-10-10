import { FindOptionsWhere, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserAppointmentsEntity } from '../../../database/entities/user-appointments.entity'

@Injectable()
export class UserAppointmentsCrudService {
  constructor(
    @InjectRepository(UserAppointmentsEntity)
    protected userAppointmentsRepository: Repository<UserAppointmentsEntity>,
  ) {}

  async getUserAppointmentById(id: string) {
    return this.userAppointmentsRepository.findOne({ where: { id } })
  }

  async getUserAppointmentsByParams(where: FindOptionsWhere<UserAppointmentsEntity>) {
    return this.userAppointmentsRepository.find({
      select: {
        id: true,
        speciality: true,
        doctor: true,
        datetime: true,
        appointment: {
          name: true,
          description: true,
        },
      },
      relations: {
        appointment: true,
      },
      where,
    })
  }

  async addUserAppointmentsByParams(params: Partial<UserAppointmentsEntity>[]) {
    return this.userAppointmentsRepository.save(params)
  }

  async updateUserAppointmentById(id: string, params: Partial<UserAppointmentsEntity>) {
    return this.userAppointmentsRepository.update(id, params)
  }

  async deleteUserAppointmentById(id: string) {
    return this.userAppointmentsRepository.delete(id)
  }
}
