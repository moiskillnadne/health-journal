import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AppController } from './app.controller'
import { DatabaseModule } from './database/database.module'

import { JWTAuthGuard } from './core/guards/jwt-auth.guard'
import { ErrorsInterceptor } from './core/interceptors/errors.interceptor'
import { LoggingInterceptor } from './core/interceptors/logging.interceptor'

import { LoggerModule } from './core/logger/logger.module'
import { ScheduleModule } from './core/services/schedule/schedule.module'
import { RemindersModule } from './core/reminders/reminders.module'
import { NotificationsModule } from './core/notifications/notifications.module'

import { UserCrudService } from './modules/api/user/user.crud'
import { UserAdminEntityBaseService } from './modules/admin-auth/services/entity/admin-auth.entity.service'
import { TrackCrud } from './modules/api/admin/track/crud/track.crud'
import { NotificationPredefinedCrud } from './modules/api/admin/notification/crud/notification-predefined.crud'

import { UserEntity } from './database/entities/user.entity'
import { UserAdminEntity } from './database/entities/user-admin.entity'
import { TrackEntity } from './database/entities/track.entity'
import { TrackGroupEntity } from './database/entities/track-group.entity'
import { NotificationPredefinedEntity } from './database/entities/notification-predefined.entity'

import { AuthModule } from './modules/auth/auth.module'
import { TestModule } from './modules/api/test/test.module'
import { DeepLinksModule } from './modules/deepLinks/deep-links.module'
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module'
import { AdminTestModule } from './modules/api/admin-test/admin-test.module'
import { UserSettingsModule } from './modules/api/user-settings/user-settings.module'
import { AdminModule } from './modules/api/admin/admin.module'
import { RegionModule } from './modules/api/region/region.module'
import { UserModule } from './modules/api/user/user.module'
import { UserCardModule } from './modules/api/user-card/user-card.module'
import { UserCardWeightModule } from './modules/api/user-card-weight/user-card-weight.module'
import { AssessmentModule } from './modules/api/assessment/assessment.module'
import { GenderModule } from './modules/api/gender/gender.module'
import { RaceModule } from './modules/api/race/race.module'
import { UserConditionsModule } from './modules/api/user-conditions/user-conditions.module'
import { ConditionsModule } from './modules/api/conditions/conditions.module'
import { ProceduresModule } from './modules/api/procedures/procedures.module'
import { UserCardAfterMealBloodSugarModule } from './modules/api/user-card-after-meal-blood-sugar/user-card-after-meal-blood-sugar.module'
import { UserCardLdlLevelModule } from './modules/api/user-card-ldl-level/user-card-ldl-level.module'
import { UserCardTriglycerideLevelModule } from './modules/api/user-card-triglyceride-level/user-card-triglyceride-level.module'
import { UserCardFastingBloodSugarModule } from './modules/api/user-card-fasting-blood-sugar/user-card-fasting-blood-sugar.module'
import { UserCardHba1cModule } from './modules/api/user-card-hba1c/user-card-hba1c.module'
import { UserCardRandomBloodSugarModule } from './modules/api/user-card-random-blood-sugar/user-card-random-blood-sugar.module'
import { UserCardStepsModule } from './modules/api/user-card-steps/user-card-steps.module'
import { UserProceduresModule } from './modules/api/user-procedures/user-procedures.module'
import { NotificationsModule as NotificationsSettingsModule } from './modules/api/notifications/notifications.module'
import { UserSettingsNotificationsModule } from './modules/api/user-settings-notifications/user-settings-notifications.module'
import { UserSettingsRemindersModule } from './modules/api/user-settings-reminders/user-settings-reminders.module'
import { SupportModule } from './modules/api/support/support.module'
import { MedicationsModule } from './modules/api/medications/medications.module'
import { GalleryModule } from './modules/api/gallery/gallery.module'
import { UserMedicationsModule } from './modules/api/user-medications/user-medications.module'
import { TriggersModule } from './modules/api/triggers/triggers.module'
import { UserCardBloodPressureModule } from './modules/api/user-card-blood-pressure/user-card-blood-pressure.module'
import { UserCardProfileModule } from './modules/api/user-card-profile/user-card-profile.module'
import { AppointmentsModule } from './modules/api/appointments/appointments.module'
import { UserAppointmentsModule } from './modules/api/user-appointments/user-appointments.module'
import { UserJourneySurveyModule } from './modules/api/user-journey-survey/user-journey-survey.module'
import { UserLifestyleSurveyModule } from './modules/api/user-lifestyle-survey/user-lifestyle-survey.module'
import { UserRemindersModule } from './modules/api/user-reminders/user-reminders.module'
import { TargetGroupModule } from './modules/api/target-group/target-group.module'
import { AdditionalInformationModule } from './modules/api/user-additional-information/additional-information.module'
import { MailchimpModule } from './integrations/mailchimp/mailchimp.module'
import { StorageModule } from './modules/api/storage/storage.module'
import { ShareModule } from './modules/api/share/share.module'
import { UserCardWaterModule } from './modules/api/user-card-water/user-card-water.module'
import { UserCardSleepModule } from './modules/api/user-card-sleep/user-card-sleep.module'
import { UserEventsModule } from './modules/api/user-events/user-events.module'
import { UserCardHeightModule } from './modules/api/user-card-height/user-card-height.module'
import { UserCardBmiModule } from './modules/api/user-card-bmi/user-card-bmi.module'
import { UserTracksModule } from './modules/api/user-tracks/user-tracks.module'
import { UserVitalsModule } from './modules/api/user-vitals/user-vitals.module'
import { UserVideosModule } from './modules/api/user-videos/user-videos.module'
import { UserArticlesModule } from './modules/api/user-articles/user-articles.module'
import { UserRecipeModule } from './modules/api/user-recipes/user-recipes.module'
import { FoodModule } from './modules/api/food/food.module'
import { FirebaseModule } from './integrations/firebase/firebase.module'
import { UserDeviceModule } from './modules/api/user-device/user-device.module'
import { UserNotificationsModule } from './modules/api/user-notifications/user-notifications.module'
import { NotificationsModule as NotificationsCoreModule } from './core/notifications/notifications.module'

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserAdminEntity,
      TrackEntity,
      TrackGroupEntity,
      NotificationPredefinedEntity,
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
    }),
    AuthModule,
    UserSettingsModule,
    AdminAuthModule,
    ConfigModule.forRoot(),
    TestModule,
    AdminTestModule,
    DeepLinksModule,
    RegionModule,
    FirebaseModule,
    NotificationsCoreModule,
    AdminModule,
    UserModule,
    UserDeviceModule,
    UserCardModule,
    UserCardWeightModule,
    AssessmentModule,
    GenderModule,
    RaceModule,
    UserCardHeightModule,
    UserConditionsModule,
    ConditionsModule,
    ProceduresModule,
    GalleryModule,
    ShareModule,
    UserCardAfterMealBloodSugarModule,
    UserCardLdlLevelModule,
    UserCardTriglycerideLevelModule,
    UserCardFastingBloodSugarModule,
    UserCardHba1cModule,
    UserCardWaterModule,
    FoodModule,
    UserCardSleepModule,
    UserCardRandomBloodSugarModule,
    UserCardStepsModule,
    UserCardBmiModule,
    UserProceduresModule,
    NotificationsSettingsModule,
    UserSettingsNotificationsModule,
    UserSettingsRemindersModule,
    SupportModule,
    AdditionalInformationModule,
    MedicationsModule,
    ScheduleModule,
    UserMedicationsModule,
    TriggersModule,
    UserCardBloodPressureModule,
    UserCardProfileModule,
    AppointmentsModule,
    UserAppointmentsModule,
    UserJourneySurveyModule,
    UserLifestyleSurveyModule,
    UserRemindersModule,
    TargetGroupModule,
    MailchimpModule,
    StorageModule,
    UserEventsModule,
    UserTracksModule,
    UserVitalsModule,
    UserVideosModule,
    UserArticlesModule,
    UserRecipeModule,
    UserNotificationsModule,
    RemindersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: JWTAuthGuard },
    UserCrudService,
    UserAdminEntityBaseService,
    TrackCrud,
    NotificationPredefinedCrud,
  ],
})
export class AppModule {}
