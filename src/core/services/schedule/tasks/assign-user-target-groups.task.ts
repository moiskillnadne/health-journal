import { Logger } from '@nestjs/common'

import { UserCrudService } from '../../../../modules/api/user/user.crud'
import { UserTargetGroupsService } from '../../../../modules/api/user-target-groups/user-target-groups.service'

const logger = new Logger('assignUserTargetGroupsTask')

export const assignUserTargetGroupsTask = async (
  userCrudService: UserCrudService,
  userTargetGroupsService: UserTargetGroupsService,
) => {
  logger.log(`Start assigning user target groups. DateTime: ${new Date()}`)

  const users = await userCrudService.getUserIds()

  const assignTargetGroupPromises = users.reduce((promises, user) => {
    return [
      ...promises,
      userTargetGroupsService.assignUserTargetGroupsByConditions(user.id),
      userTargetGroupsService.assignUserTargetGroupsByGenderAndAge(user.id),
      userTargetGroupsService.assignUserTargetGroupsByBmi(user.id),
    ]
  }, [])

  const assignTargetGroupResult = await Promise.allSettled(assignTargetGroupPromises)

  assignTargetGroupResult
    .filter((result) => result.status === 'rejected')
    .map((error: PromiseRejectedResult) => logger.error(error.reason))

  return logger.log(`Finish assigning user target groups. DateTime: ${new Date()}`)
}
