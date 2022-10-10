import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { UserTracksEntity } from '../../../../../database/entities/user-tracks.entity'
import { TrackGroupLineEntity } from '../../../../../database/entities/track-group-line.entity'
import { getTodayTrackGroupsLinesWithoutFirstDay } from '../../../../../modules/api/user-tracks/user-tracks.helper'
import { PredefinedNotificationsSendingStrategy } from '../../../notifications.constants'
import { Order } from '../../../../../constants/enums/pagination.constants'

@Injectable()
export class DailyJourneyTaskService {
  constructor(
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
    @InjectRepository(UserEntity) private userEntityRepository: Repository<UserEntity>,
    @InjectRepository(UserTracksEntity) private userTracksEntityRepository: Repository<UserTracksEntity>,
  ) {}

  public async collectNotifications(notificationType: NotificationType): Promise<RawPredefinedNotification[]> {
    const notification = await this.notificationPredefinedEntityRepository.findOneBy({ type: notificationType })

    const usersDisabledNotifications = await this.userEntityRepository.find({
      where: { settingNotifications: { myWellnessJourneytasksEnable: false } },
    })
    const usersIdsDisabledNotifications = usersDisabledNotifications.map((u) => u.id)

    //get all users tracks with published track
    const userTracks = await this.userTracksEntityRepository.find({
      relations: { track: { groups: { lines: { video: true, article: true, recipe: true } } } },
      where: { track: { isPublished: true } },
      order: {
        track: {
          groups: {
            order: Order.ASC,
            lines: {
              order: Order.ASC,
            },
          },
        },
      },
    })

    const rawNotifications: RawPredefinedNotification[] = []
    const notifiedUsersIds = []

    for (const userTrack of userTracks) {
      // get today's track lines
      const todayTrackLines = userTrack.track.groups.reduce((list: TrackGroupLineEntity[], group) => {
        return [...list, ...getTodayTrackGroupsLinesWithoutFirstDay(group.lines, group.schedule, userTrack.assignedAt)]
      }, [])

      //filter lines with unpublished gallery items
      const filteredLines = todayTrackLines.filter(
        (line) => line.video?.isPublished || line.article?.isPublished || line.recipe?.isPublished,
      )

      if (filteredLines.length && !notifiedUsersIds.includes(userTrack.userId)) {
        notifiedUsersIds.push(userTrack.userId)
        rawNotifications.push({
          userId: userTrack.userId,
          notification: notification,
          sendStrategy: usersIdsDisabledNotifications.includes(userTrack.userId)
            ? [PredefinedNotificationsSendingStrategy.inApp]
            : [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        })
      }
    }
    return rawNotifications
  }
}
