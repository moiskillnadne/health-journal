import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardTriglycerideLevelHistoryEntity } from '../../../../database/entities/user-card-triglyceride-level-history.entity'
import {
  UserCardCholesterolParamsDto,
  UserCardCholesterolDateParamsDto,
} from '../../user-card/dto/user-card-cholesterol.dto'

export class GetUserTriglycerideLevelLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['id', 'goalTriglycerideMgDl', 'goalTriglycerideMmolL'] as const),
  PickType(UserCardTriglycerideLevelHistoryEntity, ['triglycerideMgDl', 'triglycerideMmolL', 'datetime'] as const),
) {}

export class GetUserTriglycerideDto {
  public value: UserCardCholesterolParamsDto
}

export class GetUserTriglycerideResponseDto extends IntersectionType(
  GetUserTriglycerideDto,
  PickType(UserCardCholesterolDateParamsDto, ['datetime'] as const),
) {}
