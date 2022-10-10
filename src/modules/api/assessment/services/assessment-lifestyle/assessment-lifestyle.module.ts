import { Module } from '@nestjs/common'

import { UserCardProfileModule } from '../../../user-card-profile/user-card-profile.module'
import { UserJourneySurveyModule } from '../../../user-journey-survey/user-journey-survey.module'
import { UserLifestyleSurveyModule } from '../../../user-lifestyle-survey/user-lifestyle-survey.module'

import { AssessmentLifeStyleService } from './assessment-lifestyle.service'

@Module({
  imports: [UserCardProfileModule, UserJourneySurveyModule, UserLifestyleSurveyModule],
  providers: [AssessmentLifeStyleService],
  exports: [AssessmentLifeStyleService],
})
export class AssessmentLifestyleModule {}
