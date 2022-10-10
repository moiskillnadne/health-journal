import { IntersectionType } from '@nestjs/swagger'

import { UserMedicationsParentOptionalParamsDto } from '../../../../user-medications/dto/user-medications.dto'
import { UserCardGoalPressureOptionalParamsDto } from '../../../../user-card/dto/user-card.dto'
import { UserCardBloodPressureParentOptionalParamsDto } from '../../../../user-card-blood-pressure/dto/user-card-blood-pressure.dto'
import { UserCardProfileBloodPressureOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'

export class AssessmentHealthQuestionsParamsDto extends IntersectionType(
  IntersectionType(UserMedicationsParentOptionalParamsDto, UserCardGoalPressureOptionalParamsDto),
  IntersectionType(UserCardBloodPressureParentOptionalParamsDto, UserCardProfileBloodPressureOptionalParamsDto),
) {}
