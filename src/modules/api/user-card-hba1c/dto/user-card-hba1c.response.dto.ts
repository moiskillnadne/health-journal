import { PickType, IntersectionType, PartialType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardHba1cHistoryEntity } from '../../../../database/entities/user-card-hba1c-history.entity'

import { UserCardHba1cParamsDto, UserCardHba1cDateParamsDto } from './user-card-hba1c.dto'

export class GetUserHba1cDto {
  public hba1c?: number
}

export class GetUserHba1cExtendedDto {
  public value: UserCardHba1cParamsDto
}

export class GetUserHba1cResponseDto extends IntersectionType(
  GetUserHba1cExtendedDto,
  PickType(UserCardHba1cDateParamsDto, ['datetime'] as const),
) {}

export class GetUserHba1cLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['goalHba1c'] as const),
  PartialType(IntersectionType(GetUserHba1cDto, PickType(UserCardHba1cHistoryEntity, ['id', 'datetime'] as const))),
) {}
