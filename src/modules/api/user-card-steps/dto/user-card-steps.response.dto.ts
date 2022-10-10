import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'
import { UserCardStepsHistoryEntity } from '../../../../database/entities/user-card-steps-history.entity'

export class GetUserStepsResponseDto extends PickType(UserCardStepsHistoryEntity, ['steps', 'datetime'] as const) {}

export class GetUserStepsLastRecordResponseDto extends IntersectionType(
  PickType(UserCardEntity, ['goalSteps'] as const),
  PickType(UserCardStepsHistoryEntity, ['id', 'steps', 'datetime'] as const),
) {}
