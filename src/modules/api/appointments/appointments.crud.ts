import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { AppointmentsEntity } from '../../../database/entities/appointments.entity'

@Injectable()
export class AppointmentsCrudService {
  constructor(
    @InjectRepository(AppointmentsEntity)
    protected appointmentsRepository: Repository<AppointmentsEntity>,
  ) {}

  async getAppointmentsList(): Promise<AppointmentsEntity[]> {
    return this.appointmentsRepository.find()
  }

  async getAppointmentByTag(tag: string): Promise<AppointmentsEntity> {
    return this.appointmentsRepository.findOne({ where: { tag } })
  }
}
