import { InTwoWeeksHandler as DoctorAppointmentsInTwoWeeksHandler } from './predefined/handlers/doctor-appointments/in-two-weeks.handler'
import { InOneWeekHandler as DoctorAppointmentsInOneWeekHandler } from './predefined/handlers/doctor-appointments/in-one-week.handler'
import { InOneDayHandler as DoctorAppointmentsInOneDayHandler } from './predefined/handlers/doctor-appointments/in-one-day.handler'
import { OneDayAgoHandler as DoctorAppointmentsOneDayAgoHandler } from './predefined/handlers/doctor-appointments/one-day-ago.handler'
import { ThreeDaysAgoHandler as DoctorAppointmentsThreeDaysAgoHandler } from './predefined/handlers/doctor-appointments/three-days-ago.handler'
import { InTwoDaysHandler as DiabeticEyeExamInTwoDaysHandler } from './predefined/handlers/diabetic-eye-exam/in-two-days.handler'
import { InTwoWeeksHandler as DiabeticEyeExamInTwoWeeksHandler } from './predefined/handlers/diabetic-eye-exam/in-two-weeks.handler'
import { OneDayAgoHandler as DiabeticEyeExamOneDayAgoHandler } from './predefined/handlers/diabetic-eye-exam/one-day-ago.handler'
import { ToExpireHandler as DiabeticEyeExamToExpireHandler } from './predefined/handlers/diabetic-eye-exam/to-expire.handler'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import {
  scheduleDoctorAppointmentsInTwoWeeksHandler,
  scheduleDoctorAppointmentsInOneWeekHandler,
  scheduleDoctorAppointmentsInOneDayHandler,
  scheduleDoctorAppointmentsOneDayAgoHandler,
  scheduleDoctorAppointmentsThreeDaysAgoHandler,
  scheduleDiabeticEyeExamInTwoDaysHandler,
  scheduleDiabeticEyeExamInTwoWeeksHandler,
  scheduleDiabeticEyeExamOneDayAgoHandler,
  scheduleDiabeticEyeExamToExpireHandler,
  scheduleJourneyTasksDailyHandler,
  scheduleScreeningToScheduleHandler,
  scheduleMammogramToScheduleHandler,
  schedulePapSmearToScheduleHandler,
} from './notifications.constants'
import { DailyHandler as JourneyTasksDailyHandler } from './predefined/handlers/jorney-tasks/daily.handler'
import { ToScheduleHandler as ColonScreeningToScheduleHandler } from './predefined/handlers/colon-screening/to-schedule.handler'
import { ToScheduleHandler as MammogramToScheduleHandler } from './predefined/handlers/mammogram/to-schedule.handler'
import { ToScheduleHandler as PapSmearToScheduleHandler } from './predefined/handlers/pap-smear/to-schedule.handler'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'
import { NotificationType } from '../../constants/enums/notifications.constants'

@Injectable()
export class NotificationsScheduler {
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
  // scheduleDoctorAppointmentsInTwoWeeksHandler
  @Cron('44 10 * * *')
  async scheduleDoctorAppointmentsIn2WeeksHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentInTwoWeeks)) {
      await this.doctorAppointmentsInTwoWeeksHandler.handleNotifications()
    }
  }
  // scheduleDoctorAppointmentsInOneWeekHandler
  @Cron('44 10 * * *')
  async scheduleDoctorAppointmentsIn1WeekHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentInOneWeek)) {
      await this.doctorAppointmentsInOneWeekHandler.handleNotifications()
    }
  }

  // scheduleDoctorAppointmentsInOneDayHandler
  @Cron('44 10 * * *')
  async scheduleDoctorAppointmentsIn1DayHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentInOneDay)) {
      await this.doctorAppointmentsInOneDayHandler.handleNotifications()
    }
  }

  // scheduleDoctorAppointmentsOneDayAgoHandler
  @Cron('44 10 * * *')
  async scheduleDoctorAppointmentsWas1DayAgoHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentOneDayAgo)) {
      await this.doctorAppointmentsOneDayAgoHandler.handleNotifications()
    }
  }

  @Cron(scheduleDoctorAppointmentsThreeDaysAgoHandler)
  async scheduleDoctorAppointmentsWas3DaysAgoHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DoctorAppointmentThreeDaysAgo)) {
      await this.doctorAppointmentsThreeDaysAgoHandler.handleNotifications()
    }
  }

  @Cron(scheduleDiabeticEyeExamInTwoDaysHandler)
  async scheduleDiabeticEyeExamInTwoDaysHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamInTwoDays)) {
      await this.diabeticEyeExamInTwoDaysHandler.handleNotifications()
    }
  }

  @Cron(scheduleDiabeticEyeExamInTwoWeeksHandler)
  async scheduleDiabeticEyeExamInTwoWeeksHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamInTwoWeeks)) {
      await this.diabeticEyeExamInTwoWeeksHandler.handleNotifications()
    }
  }

  @Cron(scheduleDiabeticEyeExamOneDayAgoHandler)
  async scheduleDiabeticEyeExamOneDayAgoHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamOneDayAgo)) {
      await this.diabeticEyeExamOneDayAgoHandler.handleNotifications()
    }
  }

  @Cron(scheduleDiabeticEyeExamToExpireHandler)
  async scheduleDiabeticEyeExamToExpireHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.DiabeticEyeExamToExpire)) {
      await this.diabeticEyeExamToExpireHandler.handleNotifications()
    }
  }

  @Cron(scheduleJourneyTasksDailyHandler)
  async scheduleJourneyTasksDailyHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.TrackTasksAssigned)) {
      await this.journeyTasksDailyHandler.handleNotifications()
    }
  }

  @Cron(scheduleScreeningToScheduleHandler)
  async scheduleScreeningToScheduleHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.ColonScreeningToSchedule)) {
      await this.colonScreeningToScheduleHandler.handleNotifications()
    }
  }

  @Cron(scheduleMammogramToScheduleHandler)
  async scheduleMammogramToScheduleHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.MammogramToSchedule)) {
      await this.mammogramToScheduleHandler.handleNotifications()
    }
  }

  @Cron(schedulePapSmearToScheduleHandler)
  async schedulePapSmearToScheduleHandler(): Promise<void> {
    if (await this.isEnabled(NotificationType.PapSmearToSchedule)) {
      await this.papSmearToScheduleHandler.handleNotifications()
    }
  }
}
