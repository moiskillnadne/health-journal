import { Module } from '@nestjs/common'
import { PuppeteerModule } from 'nest-puppeteer'
import { UserAppointmentsModule } from '../user-appointments/user-appointments.module'
import { UserCardAfterMealBloodSugarModule } from '../user-card-after-meal-blood-sugar/user-card-after-meal-blood-sugar.module'
import { UserCardBloodPressureModule } from '../user-card-blood-pressure/user-card-blood-pressure.module'
import { UserCardFastingBloodSugarModule } from '../user-card-fasting-blood-sugar/user-card-fasting-blood-sugar.module'
import { UserCardHba1cModule } from '../user-card-hba1c/user-card-hba1c.module'
import { UserCardLdlLevelModule } from '../user-card-ldl-level/user-card-ldl-level.module'
import { UserCardRandomBloodSugarModule } from '../user-card-random-blood-sugar/user-card-random-blood-sugar.module'
import { UserCardTriglycerideLevelModule } from '../user-card-triglyceride-level/user-card-triglyceride-level.module'
import { UserCardWeightModule } from '../user-card-weight/user-card-weight.module'
import { UserCardModule } from '../user-card/user-card.module'
import { UserProceduresModule } from '../user-procedures/user-procedures.module'
import { UserSettingsModule } from '../user-settings/user-settings.module'
import { UserModule } from '../user/user.module'
import { ShareController } from './share.controller'
import { ShareService } from './share.service'

@Module({
  imports: [
    PuppeteerModule.forRoot({
      executablePath: process.env.CHROMIUM_PATH,
      ignoreDefaultArgs: [],
    }),
    UserCardModule,
    UserModule,
    UserCardWeightModule,
    UserSettingsModule,
    UserCardHba1cModule,
    UserCardLdlLevelModule,
    UserCardTriglycerideLevelModule,
    UserCardAfterMealBloodSugarModule,
    UserCardFastingBloodSugarModule,
    UserCardRandomBloodSugarModule,
    UserCardBloodPressureModule,
    UserAppointmentsModule,
    UserProceduresModule,
  ],
  controllers: [ShareController],
  providers: [ShareService],
  exports: [],
})
export class ShareModule {}
