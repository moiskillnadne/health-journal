import { SchedulableHandlerInterface } from '../handler.interface'
import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { NotificationService } from '../../notification.service'
import { UserRemindersService } from '../../../../../modules/api/user-reminders/user-reminders.service'
import { BlankPapSmearService } from '../../services/pap-smear/blank-pap-smear.service'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'

@Injectable()
export class ToScheduleHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(ToScheduleHandler.name)

  constructor(
    private notificationService: NotificationService,
    private blankPapSmearService: BlankPapSmearService,
    private userRemindersService: UserRemindersService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.PapSmearToSchedule
  }

  public async handleNotifications(): Promise<void> {
    this.logger.log('Handle Mammogram "To Schedule" notifications')
    const notifications = await this.blankPapSmearService.collectNotifications(this.getNotificationType())
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
