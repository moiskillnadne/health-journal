import { PickType, IntersectionType, PartialType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardWeightHistoryEntity } from '../../../../database/entities/user-card-weight-history.entity'

import { UserCardWeightParamsDto } from '../../user-card/dto/user-card-weight.dto'

export class GetUserWeightDto {
  value: UserCardWeightParamsDto
}

export class GetUserWeightHistoryResponseDto extends IntersectionType(
  GetUserWeightDto,
  PickType(UserCardWeightHistoryEntity, ['datetime'] as const),
) {}

export class GetUserWeightLastRecordResponseDto extends IntersectionType(
  PartialType(PickType(UserCardEntity, ['goalWeightLb', 'goalWeightKg'] as const)),
  PartialType(PickType(UserCardWeightHistoryEntity, ['id', 'weightLb', 'weightKg', 'datetime'] as const)),
) {}

export class PostWeightReponseDTO {
  code?: string
  httpCode?: number
  message?: string
  details?: Record<string, unknown>
}
