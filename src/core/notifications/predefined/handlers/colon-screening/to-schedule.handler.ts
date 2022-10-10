import { SchedulableHandlerInterface } from '../handler.interface'
import { Injectable, Logger } from '@nestjs/common'
import { NotificationService } from '../../notification.service'
import { UserRemindersService } from '../../../../../modules/api/user-reminders/user-reminders.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { BlankColonScreeningService } from '../../services/colon-screening/blank-colon-screening.service'

@Injectable()
export class ToScheduleHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(ToScheduleHandler.name)

  constructor(
    private notificationService: NotificationService,
    private blankColonScreeningService: BlankColonScreeningService,
    private userRemindersService: UserRemindersService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.ColonScreeningToExpire
  }

  public async handleNotifications(): Promise<void> {
    this.logger.log('Handle Colon Screening Tests "To Schedule" notifications')
    const notifications = await this.blankColonScreeningService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.processReminders(notifications)
    await this.notificationService.send(notifications)
  }

  protected async processReminders(rawNotifications: RawPredefinedNotification[]): Promise<void> {
    this.logger.log(`Processing reminders`)
    const notificationsUsersIds = rawNotifications.map((rawNotif) => rawNotif.userId)
    await this.userRemindersService.upsertUserRemindersByType(notificationsUsersIds, this.getNotificationType())
  }
}
