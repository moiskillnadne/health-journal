import { NotificationService } from '../../notification.service'
import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { SchedulableHandlerInterface } from '../handler.interface'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { UserRemindersService } from '../../../../../modules/api/user-reminders/user-reminders.service'
import { ToExpireEyeExamService } from '../../services/diabetic-eye-exam/to-expire-eye-exam.service'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ToExpireHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(ToExpireHandler.name)
  constructor(
    private notificationService: NotificationService,
    private toExpireEyeExamService: ToExpireEyeExamService,
    private userRemindersService: UserRemindersService,
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.DiabeticEyeExamToExpire
  }

  public async handleNotifications(): Promise<void> {
    this.logger.log('Handle Diabetic Eye Exam "To Expire" notifications')
    const notifications = await this.toExpireEyeExamService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.processReminders(notifications)
    await this.notificationService.send(notifications)
  }

  protected async processReminders(rawNotifications: RawPredefinedNotification[]): Promise<void> {
    this.logger.log(`Processing reminders`)
    const notificationsUsersIds = rawNotifications.map((rawNotif) => rawNotif.userId)
    await this.userRemindersService.upsertUserRemindersByType(
      notificationsUsersIds,
      NotificationType.DiabeticEyeExamToSchedule,
    )
  }
}
