import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardRandomBloodSugarHistoryEntity } from '../../../../database/entities/user-card-random-blood-sugar-history.entity'

import { UserCardSugarDateParamsDto, UserCardSugarParamsDto } from '../../user-card/dto/user-card-sugar.dto'

export class GetUserRandomBloodSugarDto {
  public value: UserCardSugarParamsDto
}

export class GetUserRandomBloodSugarResponseDto extends IntersectionType(
  GetUserRandomBloodSugarDto,
  PickType(UserCardSugarDateParamsDto, ['datetime'] as const),
) {}

export class GetUserRandomBloodSugarLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['id', 'goalRandomBloodSugarMgDl', 'goalRandomBloodSugarMmolL'] as const),
  PickType(UserCardRandomBloodSugarHistoryEntity, ['sugarMgDl', 'sugarMmolL', 'datetime'] as const),
) {}
