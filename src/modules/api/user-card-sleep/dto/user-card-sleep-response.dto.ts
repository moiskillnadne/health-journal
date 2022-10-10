import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { UserCardSleepHistoryEntity } from '../../../../database/entities/user-card-sleep-history.entity'
import { UserCardEntity } from '../../../../database/entities/user-card.entity'

export class GetUserCardSleepHistoryLastRecordResponseDto extends IntersectionType(
  PartialType(PickType(UserCardEntity, ['sleepGoal'] as const)),
  PartialType(PickType(UserCardSleepHistoryEntity, ['datetime', 'sleepHours', 'id'] as const)),
) {}
