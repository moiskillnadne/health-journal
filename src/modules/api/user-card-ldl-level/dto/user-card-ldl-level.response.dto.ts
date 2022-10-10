import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardLdlLevelHistoryEntity } from '../../../../database/entities/user-card-ldl-level-history.entity'
import {
  UserCardCholesterolDateParamsDto,
  UserCardCholesterolParamsDto,
} from '../../user-card/dto/user-card-cholesterol.dto'

export class GetUserLdlLevelLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['id', 'goalLdlMgDl', 'goalLdlMmolL'] as const),
  PickType(UserCardLdlLevelHistoryEntity, ['ldlMgDl', 'ldlMmolL', 'datetime'] as const),
) {}

export class GetUserLdlLevel {
  public value: UserCardCholesterolParamsDto
}

export class GetUserLdlLevelResponseDto extends IntersectionType(
  GetUserLdlLevel,
  PickType(UserCardCholesterolDateParamsDto, ['datetime'] as const),
) {}
