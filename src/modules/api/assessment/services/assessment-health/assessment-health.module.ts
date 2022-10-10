import { Module } from '@nestjs/common'

import { UserModule } from '../../../user/user.module'
import { UserCardModule } from '../../../user-card/user-card.module'
import { UserCardWeightModule } from '../../../user-card-weight/user-card-weight.module'
import { UserConditionsModule } from '../../../user-conditions/user-conditions.module'
import { ProceduresModule } from '../../../procedures/procedures.module'
import { UserProceduresModule } from '../../../user-procedures/user-procedures.module'
import { UserCardHba1cModule } from '../../../user-card-hba1c/user-card-hba1c.module'
import { UserCardRandomBloodSugarModule } from '../../../user-card-random-blood-sugar/user-card-random-blood-sugar.module'
import { UserCardFastingBloodSugarModule } from '../../../user-card-fasting-blood-sugar/user-card-fasting-blood-sugar.module'
import { UserCardAfterMealBloodSugarModule } from '../../../user-card-after-meal-blood-sugar/user-card-after-meal-blood-sugar.module'
import { UserCardLdlLevelModule } from '../../../user-card-ldl-level/user-card-ldl-level.module'
import { UserCardTriglycerideLevelModule } from '../../../user-card-triglyceride-level/user-card-triglyceride-level.module'
import { UserMedicationsModule } from '../../../user-medications/user-medications.module'
import { UserCardBloodPressureModule } from '../../../user-card-blood-pressure/user-card-blood-pressure.module'
import { UserCardProfileModule } from '../../../user-card-profile/user-card-profile.module'
import { UserAppointmentsModule } from '../../../user-appointments/user-appointments.module'
import { UserRemindersModule } from '../../../user-reminders/user-reminders.module'

import { AssessmentHealthService } from './assessment-health.service'

@Module({
  imports: [
    UserModule,
    UserCardModule,
    UserCardWeightModule,
    UserConditionsModule,
    ProceduresModule,
    UserProceduresModule,
    UserCardHba1cModule,
    UserCardRandomBloodSugarModule,
    UserCardFastingBloodSugarModule,
    UserCardAfterMealBloodSugarModule,
    UserCardLdlLevelModule,
    UserCardTriglycerideLevelModule,
    UserMedicationsModule,
    UserCardBloodPressureModule,
    UserCardProfileModule,
    UserAppointmentsModule,
    UserRemindersModule,
  ],
  providers: [AssessmentHealthService],
  exports: [AssessmentHealthService],
})
export class AssessmentHealthModule {}
