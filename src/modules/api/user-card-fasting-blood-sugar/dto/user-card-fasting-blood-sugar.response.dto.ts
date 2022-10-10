import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardFastingBloodSugarHistoryEntity } from '../../../../database/entities/user-card-fasting-blood-sugar-history.entity'

import { UserCardSugarDateParamsDto, UserCardSugarParamsDto } from '../../user-card/dto/user-card-sugar.dto'

export class GetUserFastingBloodSugarDto {
  public value: UserCardSugarParamsDto
}

export class GetUserFastingBloodSugarResponseDto extends IntersectionType(
  GetUserFastingBloodSugarDto,
  PickType(UserCardSugarDateParamsDto, ['datetime'] as const),
) {}

export class GetUserFastingBloodSugarLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['id', 'goalAfterMealBloodSugarMgDl', 'goalFastingBloodSugarMmolL'] as const),
  PickType(UserCardFastingBloodSugarHistoryEntity, ['sugarMgDl', 'sugarMmolL', 'datetime'] as const),
) {}
