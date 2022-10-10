import { OptionsResponseDto } from './../../../core/dtos/response/options.dto'
import { Injectable } from '@nestjs/common'

import { AppointmentsCrudService } from './appointments.crud'

@Injectable()
export class AppointmentsService {
  constructor(private appointmentsCrudService: AppointmentsCrudService) {}

  public async getAppointmentsList(): Promise<OptionsResponseDto[]> {
    const appointments = await this.appointmentsCrudService.getAppointmentsList()

    return appointments.map((appointment) => ({
      value: appointment.id,
      label: appointment.name,
    }))
  }
}
