import { UserCardWaterHistoryEntity } from './../../../../database/entities/user-card-water.entity'
import { UserCardEntity } from './../../../../database/entities/user-card.entity'
import { IntersectionType, PickType } from '@nestjs/swagger'

export class GetUserCardWaterHistoryLatestRecordResponseDTO extends IntersectionType(
  PickType(UserCardEntity, ['goalWaterFloz', 'goalWaterMl', 'id'] as const),
  PickType(UserCardWaterHistoryEntity, ['waterFloz', 'waterMl'] as const),
) {}
