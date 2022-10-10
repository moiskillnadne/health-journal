import { logger } from './reminders.logger'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { defaultReminderExecutionPeriod } from './reminders.constants'

import { DoctorAppointmentReminderService } from './services/doctor-appointment/doctor-appointment.service'
import { EyeExamReminderService } from './services/eye-exam/eye-exam.service'
import { ColonScreeningReminderService } from './services/screening-tests/colon-screening.service'
import { MammogramReminderService } from './services/screening-tests/mammogram.service'
import { PapSmearReminderService } from './services/screening-tests/pap-smear.service'
import { OtherProcedureReminderService } from './services/other-procedure/other-procedure.service'

@Injectable()
export class RemindersSchedule {
  constructor(
    private doctorAppointmentReminderService: DoctorAppointmentReminderService,
    private eyeExamReminderService: EyeExamReminderService,
    private colonScreeningReminderService: ColonScreeningReminderService,
    private mammogramReminderService: MammogramReminderService,
    private papSmearReminderService: PapSmearReminderService,
    private otherProcedureReminderService: OtherProcedureReminderService,
  ) {}

  // defaultReminderExecutionPeriod
  @Cron('55 15 * * *')
  async executeScheduledReminderTasks() {
    logger.log('Start execution scheduled reminder tasks')

    await this.doctorAppointmentReminderService.sendDoctorAppointmentToScheduleReminder()
    await this.eyeExamReminderService.sendEyeExamToScheduleReminder()
    await this.eyeExamReminderService.sendEyeExamToExpireReminder()
    await this.colonScreeningReminderService.sendColonScreeningToScheduleReminder()
    await this.colonScreeningReminderService.sendColonScreeningToExpireReminder()
    await this.mammogramReminderService.sendMammogramToScheduleReminder()
    await this.mammogramReminderService.sendMammogramToExpireReminder()
    await this.papSmearReminderService.sendPapSmearToScheduleReminder()
    await this.papSmearReminderService.sendPapSmearToExpireReminder()
    await this.otherProcedureReminderService.sendOtherProcedureToScheduleReminder()
    await this.otherProcedureReminderService.sendOtherProcedureToExpireReminder()

    logger.log('Finish execution scheduled reminder tasks')
  }
}
