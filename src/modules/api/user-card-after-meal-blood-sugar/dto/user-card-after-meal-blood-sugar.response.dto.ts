import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardAfterMealBloodSugarHistoryEntity } from '../../../../database/entities/user-card-after-meal-blood-sugar-history.entity'

import { UserCardSugarDateParamsDto, UserCardSugarParamsDto } from '../../user-card/dto/user-card-sugar.dto'

export class GetUserAfterMealBloodSugarDto {
  public value: UserCardSugarParamsDto
}

export class GetUserAfterMealBloodSugarResponseDto extends IntersectionType(
  GetUserAfterMealBloodSugarDto,
  PickType(UserCardSugarDateParamsDto, ['datetime'] as const),
) {}

export class GetUserAfterMealBloodSugarLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['id', 'goalAfterMealBloodSugarMgDl', 'goalAfterMealBloodSugarMmolL'] as const),
  PickType(UserCardAfterMealBloodSugarHistoryEntity, ['sugarMgDl', 'sugarMmolL', 'datetime'] as const),
) {}
