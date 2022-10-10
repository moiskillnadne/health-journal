import { IntersectionType, PickType } from '@nestjs/swagger'

import { ConditionsEntity } from '../../../../database/entities/conditions.entity'
import { UserConditionsEntity } from '../../../../database/entities/user-conditions.entity'

export class UserConditionsResponseDto extends IntersectionType(
  PickType(ConditionsEntity, ['name'] as const),
  PickType(UserConditionsEntity, ['id', 'info', 'status', 'conditionResolvedDate', 'createAt'] as const),
) {}
