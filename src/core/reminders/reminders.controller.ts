import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Public } from '../decorators/public-route.decorator'

import { DoctorAppointmentReminderService } from './services/doctor-appointment/doctor-appointment.service'
import { EyeExamReminderService } from './services/eye-exam/eye-exam.service'
import { ColonScreeningReminderService } from './services/screening-tests/colon-screening.service'
import { MammogramReminderService } from './services/screening-tests/mammogram.service'
import { PapSmearReminderService } from './services/screening-tests/pap-smear.service'
import { OtherProcedureReminderService } from './services/other-procedure/other-procedure.service'

@ApiTags('Reminders')
@Public()
@Controller('reminders')
export class RemindersController {
  constructor(
    private doctorAppointmentReminderService: DoctorAppointmentReminderService,
    private eyeExamReminderService: EyeExamReminderService,
    private colonScreeningReminderService: ColonScreeningReminderService,
    private mammogramReminderService: MammogramReminderService,
    private papSmearReminderService: PapSmearReminderService,
    private otherProcedureReminderService: OtherProcedureReminderService,
  ) {}

  @Get('doctor-appointment-to-schedule')
  public sendDoctorAppointmentToScheduleReminder() {
    return this.doctorAppointmentReminderService.sendDoctorAppointmentToScheduleReminder()
  }

  @Get('eye-exam-to-schedule')
  public sendEyeExamToScheduleReminder() {
    return this.eyeExamReminderService.sendEyeExamToScheduleReminder()
  }

  @Get('eye-exam-to-expire')
  public sendEyeExamToExpireReminder() {
    return this.eyeExamReminderService.sendEyeExamToExpireReminder()
  }

  @Get('colon-screening-to-schedule')
  public sendColonScreeningToScheduleReminder() {
    return this.colonScreeningReminderService.sendColonScreeningToScheduleReminder()
  }

  @Get('colon-screening-to-expire')
  public sendColonScreeningToExpireReminder() {
    return this.colonScreeningReminderService.sendColonScreeningToExpireReminder()
  }

  @Get('mammogram-to-schedule')
  public sendMammogramToScheduleReminder() {
    return this.mammogramReminderService.sendMammogramToScheduleReminder()
  }

  @Get('mammogram-to-expire')
  public sendMammogramToExpireReminder() {
    return this.mammogramReminderService.sendMammogramToExpireReminder()
  }

  @Get('pap-smear-to-schedule')
  public sendPapSmearToScheduleReminder() {
    return this.papSmearReminderService.sendPapSmearToScheduleReminder()
  }

  @Get('pap-smear-to-expire')
  public sendPapSmearToExpireReminder() {
    return this.papSmearReminderService.sendPapSmearToExpireReminder()
  }

  @Get('other-procedure-to-schedule')
  public sendOtherProcedureToScheduleReminder() {
    return this.otherProcedureReminderService.sendOtherProcedureToScheduleReminder()
  }

  @Get('other-procedure-to-expire')
  public sendOtherProcedureToExpireReminder() {
    return this.otherProcedureReminderService.sendOtherProcedureToExpireReminder()
  }
}
