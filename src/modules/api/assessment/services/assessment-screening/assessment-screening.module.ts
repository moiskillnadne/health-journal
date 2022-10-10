import { Module } from '@nestjs/common'

import { ProceduresModule } from '../../../procedures/procedures.module'
import { UserProceduresModule } from '../../../user-procedures/user-procedures.module'
import { UserCardProfileModule } from '../../../user-card-profile/user-card-profile.module'
import { UserRemindersModule } from '../../../user-reminders/user-reminders.module'

import { AssessmentScreeningService } from './assessment-screening.service'

@Module({
  imports: [ProceduresModule, UserProceduresModule, UserCardProfileModule, UserRemindersModule],
  providers: [AssessmentScreeningService],
  exports: [AssessmentScreeningService],
})
export class AssessmentScreeningModule {}
