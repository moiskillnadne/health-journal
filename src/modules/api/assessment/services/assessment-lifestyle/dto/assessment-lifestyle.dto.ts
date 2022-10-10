import { IntersectionType } from '@nestjs/swagger'

import { UserCardProfileLifestyleOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'
import { UserJourneySurveyOptionalParamsDto } from '../../../../user-journey-survey/dto/user-journey-survey.dto'
import { UserLifestyleSurveyOptionalParamsDto } from '../../../../user-lifestyle-survey/dto/user-lifestyle-survey.dto'

export class AssessmentLifestyleParamsDto extends IntersectionType(
  UserCardProfileLifestyleOptionalParamsDto,
  IntersectionType(UserJourneySurveyOptionalParamsDto, UserLifestyleSurveyOptionalParamsDto),
) {}
