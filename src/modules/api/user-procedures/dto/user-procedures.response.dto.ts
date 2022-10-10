import { IntersectionType, PickType } from '@nestjs/swagger'

import { ProceduresEntity } from '../../../../database/entities/procedures.entity'
import { UserProceduresEntity } from '../../../../database/entities/user-procedures.entity'

import { UserProceduresRepeatParamsDto } from './user-procedures.dto'

export class GetUserProcedureCustomDto {
  procedureId: string
}

export class GetUserProcedureSummaryDto extends IntersectionType(
  PickType(ProceduresEntity, ['name', 'description'] as const),
  PickType(UserProceduresEntity, ['datetime'] as const),
) {}

export class GetUserProcedureResponseDto extends IntersectionType(
  GetUserProcedureCustomDto,
  GetUserProcedureSummaryDto,
) {
  otherEventName: string
}

export class GetUserProcedureEntityDto extends IntersectionType(
  UserProceduresRepeatParamsDto,
  PickType(UserProceduresEntity, ['id', 'procedureId', 'name', 'datetime'] as const),
) {}
