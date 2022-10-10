import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppointmentsEntity } from '../../../database/entities/appointments.entity'

import { AppointmentsCrudService } from './appointments.crud'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentsEntity])],
  providers: [AppointmentsCrudService, AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsCrudService, AppointmentsService],
})
export class AppointmentsModule {}
