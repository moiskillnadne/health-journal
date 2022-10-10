import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserAppointmentsEntity } from '../../../database/entities/user-appointments.entity'

import { UserAppointmentsCrudService } from './user-appointments.crud'
import { UserAppointmentsService } from './user-appointments.service'
import { UserAppointmentsController } from './user-appointments.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserAppointmentsEntity])],
  providers: [UserAppointmentsCrudService, UserAppointmentsService],
  controllers: [UserAppointmentsController],
  exports: [UserAppointmentsCrudService, UserAppointmentsService],
})
export class UserAppointmentsModule {}
