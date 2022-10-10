import { UserTargetGroupsEntity } from '../../../database/entities/user-target-groups.entity'
import { UserConditionsEntity } from '../../../database/entities/user-conditions.entity'

import { ConditionStatus, conditionToTargetGroup } from '../../../constants/enums/condition.constants'

export const getUserTargetGroupTags = (userTargetGroups: UserTargetGroupsEntity[]) => {
  return userTargetGroups.map((item) => item.targetGroup.tag)
}

export const getUserConditionsTags = (userConditions: UserConditionsEntity[]) => {
  return userConditions.filter((item) => item.status === ConditionStatus.Current).map((item) => item.condition.tag)
}

export const getUserConditionsTargetGroupTags = (userConditions: UserConditionsEntity[]) => {
  return userConditions
    .filter((item) => item.status === ConditionStatus.Current)
    .map((item) => conditionToTargetGroup[item.condition.tag])
}
