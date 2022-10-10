import { IntersectionType } from '@nestjs/swagger'

import { UserPersonalParamsDto } from '../../user/dto/user.dto'
import { UserCardPersonalParamsDto } from '../../user-card/dto/user-card.dto'
import { UserCardWeightParamsDto } from '../../user-card-weight/dto/user-card-weight.dto'

export class AssessmentPersonalInfoParamsDto extends IntersectionType(
  IntersectionType(UserPersonalParamsDto, UserCardPersonalParamsDto),
  UserCardWeightParamsDto,
) {}
