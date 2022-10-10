import { Logger } from '@nestjs/common'

import { UserCrudService } from '../../../../modules/api/user/user.crud'
import { UserTracksService } from '../../../../modules/api/user-tracks/user-tracks.service'

const logger = new Logger('assignUserTracksTask')

export const assignUserTracksTask = async (userCrudService: UserCrudService, userTracksService: UserTracksService) => {
  logger.log(`Start assigning user tracks. DateTime: ${new Date()}`)

  const users = await userCrudService.getUserIds()

  const assignTracksPromises = users.reduce((promises, user) => {
    return [...promises, userTracksService.assignUserTracksByUserId(user.id)]
  }, [])

  const assignTracksResult = await Promise.allSettled(assignTracksPromises)

  assignTracksResult
    .filter((result) => result.status === 'rejected')
    .map((error: PromiseRejectedResult) => logger.error(error.reason))

  return logger.log(`Finish assigning user tracks. DateTime: ${new Date()}`)
}
