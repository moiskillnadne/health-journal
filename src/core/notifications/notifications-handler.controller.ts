import { Repository } from 'typeorm'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import { Public } from '../decorators/public-route.decorator'
import { NotificationType } from '../../constants/enums/notifications.constants'

import { NotificationPredefinedEntity } from '../../database/entities/notification-predefined.entity'

import { InTwoWeeksHandler as DoctorAppointmentsInTwoWeeksHandler } from './predefined/handlers/doctor-appointments/in-two-weeks.handler'
import { InOneWeekHandler as DoctorAppointmentsInOneWeekHandler } from './predefined/handlers/doctor-appointments/in-one-week.handler'
import { InOneDayHandler as DoctorAppointmentsInOneDayHandler } from './predefined/handlers/doctor-appointments/in-one-day.handler'
import { OneDayAgoHandler as DoctorAppointmentsOneDayAgoHandler } from './predefined/handlers/doctor-appointments/one-day-ago.handler'
import { ThreeDaysAgoHandler as DoctorAppointmentsThreeDaysAgoHandler } from './predefined/handlers/doctor-appointments/three-days-ago.handler'
import { InTwoDaysHandler as DiabeticEyeExamInTwoDaysHandler } from './predefined/handlers/diabetic-eye-exam/in-two-days.handler'
import { InTwoWeeksHandler as DiabeticEyeExamInTwoWeeksHandler } from './predefined/handlers/diabetic-eye-exam/in-two-weeks.handler'
import { OneDayAgoHandler as DiabeticEyeExamOneDayAgoHandler } from './predefined/handlers/diabetic-eye-exam/one-day-ago.handler'
import { ToExpireHandler as DiabeticEyeExamToExpireHandler } from './predefined/handlers/diabetic-eye-exam/to-expire.handler'
import { DailyHandler as JourneyTasksDailyHandler } from './predefined/handlers/jorney-tasks/daily.handler'
import { ToScheduleHandler as ColonScreeningToScheduleHandler } from './predefined/handlers/colon-screening/to-schedule.handler'
import { ToScheduleHandler as MammogramToScheduleHandler } from './predefined/handlers/mammogram/to-schedule.handler'
import { ToScheduleHandler as PapSmearToScheduleHandler } from './predefined/handlers/pap-smear/to-schedule.handler'

@ApiTags('Notifications Handler')
@Public()
@Controller('notifications-handler')
export class NotificationsHandlerController {
  constructor(
    private doctorAppointmentsInTwoWeeksHandler: DoctorAppointmentsInTwoWeeksHandler,
    private doctorAppointmentsInOneWeekHandler: DoctorAppointmentsInOneWeekHandler,
    private doctorAppointmentsInOneDayHandler: DoctorAppointmentsInOneDayHandler,
    private doctorAppointmentsOneDayAgoHandler: DoctorAppointmentsOneDayAgoHandler,
    private doctorAppointmentsThreeDaysAgoHandler: DoctorAppointmentsThreeDaysAgoHandler,
    private diabeticEyeExamInTwoDaysHandler: DiabeticEyeExamInTwoDaysHandler,
    private diabeticEyeExamInTwoWeeksHandler: DiabeticEyeExamInTwoWeeksHandler,
    private diabeticEyeExamOneDayAgoHandler: DiabeticEyeExamOneDayAgoHandler,
    private diabeticEyeExamToExpireHandler: DiabeticEyeExamToExpireHandler,
    private journeyTasksDailyHandler: JourneyTasksDailyHandler,
    private colonScreeningToScheduleHandler: ColonScreeningToScheduleHandler,
    private mammogramToScheduleHandler: MammogramToScheduleHandler,
    private papSmearToScheduleHandler: PapSmearToScheduleHandler,
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
  ) {}

  protected async isEnabled(type: NotificationType): Promise<boolean> {
    return (await this.notificationPredefinedEntityRepository.findOneBy({ type })).isPublished
  }

  @Get('doctor-appointments/in-two-weeks')
  async sendDoctorAppointmentsIn2WeeksHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentInTwoWeeks)) {
      await this.doctorAppointmentsInTwoWeeksHandler.handleNotifications()
    }
  }

  @Get('doctor-appointments/in-one-week')
  async sendDoctorAppointmentsIn1WeekHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentInOneWeek)) {
      await this.doctorAppointmentsInOneWeekHandler.handleNotifications()
    }
  }

  @Get('doctor-appointments/in-one-day')
  async sendDoctorAppointmentsIn1DayHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentInOneDay)) {
      await this.doctorAppointmentsInOneDayHandler.handleNotifications()
    }
  }

  @Get('doctor-appointments/one-day-ago')
  async sendDoctorAppointmentsWas1DayAgoHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentOneDayAgo)) {
      await this.doctorAppointmentsOneDayAgoHandler.handleNotifications()
    }
  }

  @Get('doctor-appointments/three-days-ago')
  async sendDoctorAppointmentsWas3DaysAgoHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentThreeDaysAgo)) {
      await this.doctorAppointmentsThreeDaysAgoHandler.handleNotifications()
    }
  }

  @Get('diabetic-eye-exam/in-two-days')
  async sendDiabeticEyeExamInTwoDaysHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamInTwoDays)) {
      await this.diabeticEyeExamInTwoDaysHandler.handleNotifications()
    }
  }

  @Get('diabetic-eye-exam/in-two-weeks')
  async sendDiabeticEyeExamInTwoWeeksHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamInTwoWeeks)) {
      await this.diabeticEyeExamInTwoWeeksHandler.handleNotifications()
    }
  }

  @Get('diabetic-eye-exam/one-day-ago')
  async sendDiabeticEyeExamOneDayAgoHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamOneDayAgo)) {
      await this.diabeticEyeExamOneDayAgoHandler.handleNotifications()
    }
  }

  @Get('diabetic-eye-exam/to-expire')
  async sendDiabeticEyeExamToExpireHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamToExpire)) {
      await this.diabeticEyeExamToExpireHandler.handleNotifications()
    }
  }

  @Get('journey-tasks/daily')
  async sendJourneyTasksDailyHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.TrackTasksAssigned)) {
      await this.journeyTasksDailyHandler.handleNotifications()
    }
  }

  @Get('colon-screening/to-schedule')
  async sendScreeningToScheduleHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.ColonScreeningToSchedule)) {
      await this.colonScreeningToScheduleHandler.handleNotifications()
    }
  }

  @Get('mammogram/to-schedule')
  async sendMammogramToScheduleHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.MammogramToSchedule)) {
      await this.mammogramToScheduleHandler.handleNotifications()
    }
  }

  @Get('pap-smear/to-schedule')
  async sendPapSmearToScheduleHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.PapSmearToSchedule)) {
      await this.papSmearToScheduleHandler.handleNotifications()
    }
  }
}
