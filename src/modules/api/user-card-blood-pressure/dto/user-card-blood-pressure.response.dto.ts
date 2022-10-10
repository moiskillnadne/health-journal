import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardBloodPressureHistoryEntity } from '../../../../database/entities/user-card-blood-pressure-history.entity'

import { UserCardBloodPressureParamsDto, UserCardBloodPressureDateParamsDto } from './user-card-blood-pressure.dto'

export class GetUserBloodPressureDto {
  value: UserCardBloodPressureParamsDto
}

export class GetUserBloodPressureResponseDto extends IntersectionType(
  GetUserBloodPressureDto,
  PickType(UserCardBloodPressureDateParamsDto, ['datetime'] as const),
) {}

export class GetUserBloodPressureLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['id', 'goalPressureSystolicMmHg', 'goalPressureDiastolicMmHg'] as const),
  PickType(UserCardBloodPressureHistoryEntity, ['pressureSystolicMmHg', 'pressureDiastolicMmHg', 'datetime'] as const),
) {}
