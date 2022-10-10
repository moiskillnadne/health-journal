import { OptionsResponseDto } from './../../../core/dtos/response/options.dto'
import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AppointmentsService } from './appointments.service'

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getAppointmentsList() {
    return this.appointmentsService.getAppointmentsList()
  }
}
