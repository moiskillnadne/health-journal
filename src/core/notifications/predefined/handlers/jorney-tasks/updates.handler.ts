import { Injectable, Logger } from '@nestjs/common'
import { NotificationService } from '../../notification.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { HandlerInterface } from '../handler.interface'
import { TrackUpdatesService } from '../../services/jorney-tasks/track-updates.service'

@Injectable()
export class UpdatesHandler implements HandlerInterface {
  private readonly logger = new Logger(UpdatesHandler.name)

  constructor(private notificationService: NotificationService, private trackUpdatesService: TrackUpdatesService) {}

  public getNotificationType(): NotificationType {
    return NotificationType.TrackTasksUpdated
  }

  public async handleNotifications(updatedTrackId: string): Promise<void> {
    this.logger.log(`Handle My Wellness Journey tasks "Track updates" notifications for track #${updatedTrackId}`)
    const notifications = await this.trackUpdatesService.collectNotifications(
      this.getNotificationType(),
      updatedTrackId,
    )
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
