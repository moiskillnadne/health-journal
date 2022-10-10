import { Module } from '@nestjs/common'

import { UserAppointmentsModule } from '../user-appointments/user-appointments.module'
import { UserProceduresModule } from '../user-procedures/user-procedures.module'

import { UserEventsService } from './user-events.service'
import { UserEventsController } from './user-events.controller'

@Module({
  imports: [UserAppointmentsModule, UserProceduresModule],
  controllers: [UserEventsController],
  providers: [UserEventsService],
  exports: [UserEventsService],
})
export class UserEventsModule {}
