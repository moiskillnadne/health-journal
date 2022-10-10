import { Injectable, Logger } from '@nestjs/common'
import { NotificationService } from '../../notification.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { SchedulableHandlerInterface } from '../handler.interface'
import { ScheduledEyeExamService } from '../../services/diabetic-eye-exam/scheduled-eye-exam.service'

@Injectable()
export class OneDayAgoHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(OneDayAgoHandler.name)
  constructor(
    private notificationService: NotificationService,
    private scheduledEyeExamService: ScheduledEyeExamService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.DiabeticEyeExamOneDayAgo
  }

  public async handleNotifications(): Promise<void> {
    this.logger.log('Handle Diabetic Eye Exam "One Day Ago" notifications')
    const notifications = await this.scheduledEyeExamService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
