import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { UserCardModule } from '../user-card/user-card.module'
import { UserCardWeightModule } from '../user-card-weight/user-card-weight.module'
import { UserTargetGroupsModule } from '../user-target-groups/user-target-groups.module'
import { UserTracksModule } from '../user-tracks/user-tracks.module'
import { AssessmentHealthModule } from './services/assessment-health/assessment-health.module'
import { AssessmentScreeningModule } from './services/assessment-screening/assessment-screening.module'
import { AssessmentLifestyleModule } from './services/assessment-lifestyle/assessment-lifestyle.module'

import { AssessmentService } from './assessment.service'
import { AssessmentController } from './assessment.controller'

@Module({
  imports: [
    UserModule,
    UserCardModule,
    UserCardWeightModule,
    UserTargetGroupsModule,
    UserTracksModule,
    AssessmentHealthModule,
    AssessmentScreeningModule,
    AssessmentLifestyleModule,
  ],
  providers: [AssessmentService],
  controllers: [AssessmentController],
  exports: [AssessmentService],
})
export class AssessmentModule {}
