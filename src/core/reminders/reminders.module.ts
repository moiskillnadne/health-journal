import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { NotificationsModule } from '../notifications/notifications.module'
import { UserRemindersModule } from '../../modules/api/user-reminders/user-reminders.module'

import { RemindersSchedule } from './reminders.schedule'

import { DoctorAppointmentReminderService } from './services/doctor-appointment/doctor-appointment.service'
import { EyeExamReminderService } from './services/eye-exam/eye-exam.service'
import { ColonScreeningReminderService } from './services/screening-tests/colon-screening.service'
import { MammogramReminderService } from './services/screening-tests/mammogram.service'
import { PapSmearReminderService } from './services/screening-tests/pap-smear.service'
import { OtherProcedureReminderService } from './services/other-procedure/other-procedure.service'

import { RemindersController } from './reminders.controller'

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsModule, UserRemindersModule],
  providers: [
    RemindersSchedule,
    DoctorAppointmentReminderService,
    EyeExamReminderService,
    ColonScreeningReminderService,
    MammogramReminderService,
    PapSmearReminderService,
    OtherProcedureReminderService,
  ],
  controllers: [RemindersController],
})
export class RemindersModule {}
