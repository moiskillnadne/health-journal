import { SchedulableHandlerInterface } from '../handler.interface'
import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { NotificationService } from '../../notification.service'
import { DailyJourneyTaskService } from '../../services/jorney-tasks/daily-journey-task.service'

@Injectable()
export class DailyHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(DailyHandler.name)

  constructor(
    private notificationService: NotificationService,
    private dailyJourneyTaskService: DailyJourneyTaskService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.TrackTasksAssigned
  }

  public async handleNotifications(): Promise<void> {
    this.logger.log('Handle My Wellness Journey tasks "Daily tasks" notifications')
    const notifications = await this.dailyJourneyTaskService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
