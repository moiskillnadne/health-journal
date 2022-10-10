import { Injectable, Logger } from '@nestjs/common'
import { NotificationService } from '../../notification.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { ScheduledEyeExamService } from '../../services/diabetic-eye-exam/scheduled-eye-exam.service'
import { SchedulableHandlerInterface } from '../handler.interface'

@Injectable()
export class InTwoDaysHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(InTwoDaysHandler.name)
  constructor(
    private notificationService: NotificationService,
    private scheduledEyeExamService: ScheduledEyeExamService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.DiabeticEyeExamInTwoDays
  }

  public async handleNotifications(): Promise<void> {
    this.logger.log('Handle Diabetic Eye Exam "In Two Days" notifications')
    const notifications = await this.scheduledEyeExamService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
