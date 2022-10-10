import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'
import { PredefinedNotificationsSendingStrategy } from '../../../notifications.constants'
import { UserTracksEntity } from '../../../../../database/entities/user-tracks.entity'

@Injectable()
export class TrackUpdatesService {
  constructor(
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
    @InjectRepository(UserTracksEntity)
    protected userTracksRepository: Repository<UserTracksEntity>,
  ) {}

  public async collectNotifications(
    notificationType: NotificationType,
    updatedTrackId: string,
  ): Promise<RawPredefinedNotification[]> {
    const notification = await this.notificationPredefinedEntityRepository.findOneBy({
      type: notificationType,
    })
    const trackUserTracks = await this.userTracksRepository.find({
      where: { trackId: updatedTrackId },
      relations: {
        user: { settingNotifications: true },
      },
    })

    return trackUserTracks.map((uTrack) => ({
      userId: uTrack.userId,
      notification: notification,
      sendStrategy: !uTrack.user?.settingNotifications?.newsAndUpdatesEnable
        ? [PredefinedNotificationsSendingStrategy.inApp]
        : [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
    }))
  }
}
