import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

import { FirebaseModule } from '../../integrations/firebase/firebase.module'

import { UserEntity } from '../../database/entities/user.entity'
import { UserAppointmentsEntity } from '../../database/entities/user-appointments.entity'
import { UserProceduresEntity } from '../../database/entities/user-procedures.entity'
import { UserNotificationsPredefinedEntity } from '../../database/entities/user-notifications-predefined.entity'
import { NotificationPredefinedEntity } from '../../database/entities/notification-predefined.entity'
import { UserTracksEntity } from '../../database/entities/user-tracks.entity'

import { UserRemindersModule } from '../../modules/api/user-reminders/user-reminders.module'
import { UserProceduresModule } from '../../modules/api/user-procedures/user-procedures.module'
import { UserSettingsNotificationsModule } from '../../modules/api/user-settings-notifications/user-settings-notifications.module'

import { InTwoWeeksHandler as DoctorAppointmentInTwoWeeksHandler } from './predefined/handlers/doctor-appointments/in-two-weeks.handler'
import { InOneWeekHandler as DoctorAppointmentInOneWeekHandler } from './predefined/handlers/doctor-appointments/in-one-week.handler'
import { InOneDayHandler as DoctorAppointmentInOneDayHandler } from './predefined/handlers/doctor-appointments/in-one-day.handler'
import { OneDayAgoHandler as DoctorAppointmentOneDayAgoHandler } from './predefined/handlers/doctor-appointments/one-day-ago.handler'
import { ThreeDaysAgoHandler as DoctorAppointmentThreeDaysAgoHandler } from './predefined/handlers/doctor-appointments/three-days-ago.handler'
import { InTwoWeeksHandler as EyeExamInTwoWeeksHandler } from './predefined/handlers/diabetic-eye-exam/in-two-weeks.handler'
import { InTwoDaysHandler as EyeExamInTwoDaysHandler } from './predefined/handlers/diabetic-eye-exam/in-two-days.handler'
import { OneDayAgoHandler as EyeExamOneDayAgoHandler } from './predefined/handlers/diabetic-eye-exam/one-day-ago.handler'
import { ToExpireHandler as EyeExamToExpireHandler } from './predefined/handlers/diabetic-eye-exam/to-expire.handler'
import { ToScheduleHandler as ColonScreeningToScheduleHandler } from './predefined/handlers/colon-screening/to-schedule.handler'
import { BlankColonScreeningService } from './predefined/services/colon-screening/blank-colon-screening.service'
import { ScheduledAppointmentsService } from './predefined/services/doctor-appointments/scheduled-appointments.service'
import { ScheduledEyeExamService } from './predefined/services/diabetic-eye-exam/scheduled-eye-exam.service'
import { ToExpireEyeExamService } from './predefined/services/diabetic-eye-exam/to-expire-eye-exam.service'
import { NotificationService } from './predefined/notification.service'
import { ToScheduleHandler as MammogramToScheduleHandler } from './predefined/handlers/mammogram/to-schedule.handler'
import { ToScheduleHandler as PapSmearToScheduleHandler } from './predefined/handlers/pap-smear/to-schedule.handler'
import { BlankMammogramService } from './predefined/services/mammogram/blank-mammogram.service'
import { BlankPapSmearService } from './predefined/services/pap-smear/blank-pap-smear.service'
import { UserRemindersEntity } from '../../database/entities/user-reminders.entity'
import { DailyHandler as WellnessJourneyDailyHandler } from './predefined/handlers/jorney-tasks/daily.handler'
import { DailyJourneyTaskService } from './predefined/services/jorney-tasks/daily-journey-task.service'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { UpdatesHandler as WellnessJourneyUpdatesHandler } from './predefined/handlers/jorney-tasks/updates.handler'
import { TrackUpdatesService } from './predefined/services/jorney-tasks/track-updates.service'
import { SendNotificationsService as SendCustomNotificationsService } from './custom/send-notifications.service'
import { UserTargetGroupsEntity } from '../../database/entities/user-target-groups.entity'
import { UserNotificationsModule } from '../../modules/api/user-notifications/user-notifications.module'
import { NotificationsHandlerController } from './notifications-handler.controller'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      UserEntity,
      UserAppointmentsEntity,
      UserProceduresEntity,
      UserNotificationsPredefinedEntity,
      NotificationPredefinedEntity,
      UserRemindersEntity,
      UserTracksEntity,
      UserTargetGroupsEntity,
    ]),
    FirebaseModule,
    UserRemindersModule,
    UserNotificationsModule,
    UserProceduresModule,
    UserSettingsNotificationsModule,
  ],
  providers: [
    //handlers
    DoctorAppointmentInTwoWeeksHandler,
    DoctorAppointmentInOneWeekHandler,
    DoctorAppointmentInOneDayHandler,
    DoctorAppointmentOneDayAgoHandler,
    DoctorAppointmentThreeDaysAgoHandler,
    EyeExamInTwoWeeksHandler,
    EyeExamInTwoDaysHandler,
    EyeExamOneDayAgoHandler,
    EyeExamToExpireHandler,
    ColonScreeningToScheduleHandler,
    MammogramToScheduleHandler,
    PapSmearToScheduleHandler,
    WellnessJourneyDailyHandler,
    WellnessJourneyUpdatesHandler,
    //crud
    //services
    BlankColonScreeningService,
    ScheduledAppointmentsService,
    ScheduledEyeExamService,
    ToExpireEyeExamService,
    NotificationService,
    BlankMammogramService,
    BlankPapSmearService,
    DailyJourneyTaskService,
    TrackUpdatesService,
    SendCustomNotificationsService,
    NotificationsService,
  ],
  exports: [
    NotificationService,
    WellnessJourneyUpdatesHandler,
    SendCustomNotificationsService,
    WellnessJourneyDailyHandler,
  ],
  controllers: [NotificationsController, NotificationsHandlerController],
})
export class NotificationsModule {}
