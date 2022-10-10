import { IntersectionType } from '@nestjs/swagger'

import { UserAppointmentsParentOptionalParamsDto } from '../../../../user-appointments/dto/user-appointments.dto'
import { UserCardProfileAppointmentsOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'

export class AssessmentHealthAppointmentsParamsDto extends IntersectionType(
  UserAppointmentsParentOptionalParamsDto,
  UserCardProfileAppointmentsOptionalParamsDto,
) {}
