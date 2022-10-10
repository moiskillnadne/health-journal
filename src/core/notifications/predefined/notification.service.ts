import { Injectable } from '@nestjs/common'
import { PreparedPredefinedNotification, RawPredefinedNotification } from './dto/notifications-predefined.dto'
import { UserNotificationsPredefinedEntity } from '../../../database/entities/user-notifications-predefined.entity'
import { mapBy } from '../../helpers/object-format'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../../../database/entities/user.entity'
import { In, Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../database/entities/notification-predefined.entity'
import { FirebaseService } from '../../../integrations/firebase/firebase.service'
import { compilePredefinedNotificationMessage } from '../../helpers/compile-notification-messages'
import { Logger } from '@nestjs/common'
import { UserProceduresEntity } from '../../../database/entities/user-procedures.entity'
import { UserAppointmentsEntity } from '../../../database/entities/user-appointments.entity'
import { PredefinedNotificationsSendingStrategy } from '../notifications.constants'

@Injectable()
export class NotificationService {
  private readonly logger = new Logger('Send predefined notifications')
  constructor(
    @InjectRepository(UserEntity) private userEntityRepository: Repository<UserEntity>,
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
    @InjectRepository(UserNotificationsPredefinedEntity)
    private userNotificationsPredefinedEntityRepository: Repository<UserNotificationsPredefinedEntity>,
    @InjectRepository(UserProceduresEntity) private userProceduresEntityRepository: Repository<UserProceduresEntity>,
    @InjectRepository(UserAppointmentsEntity)
    private userAppointmentsEntityRepository: Repository<UserAppointmentsEntity>,
    private firebaseService: FirebaseService,
  ) {}

  protected prepareInApp(notification: PreparedPredefinedNotification): Partial<UserNotificationsPredefinedEntity> {
    return {
      title: notification.notification.name,
      bodyEn: notification.notification.contentEn,
      bodySp: notification.notification.contentSp,
      user: notification.user,
      notification: notification.notification,
      appointment: notification.userAppointment,
      procedure: notification.userProcedure,
    }
  }

  public async sendInApp(notifications: PreparedPredefinedNotification[]): Promise<void> {
    const inAppNotifications = notifications.filter((notif) =>
      notif.sendStrategy.includes(PredefinedNotificationsSendingStrategy.inApp),
    )
    await this.userNotificationsPredefinedEntityRepository.save(inAppNotifications.map(this.prepareInApp))
  }

  protected preparePush(notification: PreparedPredefinedNotification) {
    return compilePredefinedNotificationMessage(notification.notification, notification.user.id, {
      userAppointmentId: notification.userAppointment?.id,
      userProcedureId: notification.userProcedure?.id,
    })
  }

  public async sendPush(notifications: PreparedPredefinedNotification[]): Promise<void> {
    const pushNotifications = notifications.filter((notif) =>
      notif.sendStrategy.includes(PredefinedNotificationsSendingStrategy.push),
    )

    const sendPushPromises = pushNotifications.map((notification) => {
      const preparedMessage = this.preparePush(notification)
      return this.firebaseService.sendNotification(preparedMessage.recipients, preparedMessage.message)
    })

    const sendPushPromisesResults = await Promise.allSettled(sendPushPromises)

    const pushSendSuccess = sendPushPromisesResults.filter((pResult) => pResult.status === 'fulfilled')

    this.logger.log(`sendPushNotificationSuccess - ${pushSendSuccess.length}`)

    sendPushPromisesResults
      .filter((pResult) => pResult.status === 'rejected')
      .map((error: PromiseRejectedResult) => this.logger.error(error.reason))
  }

  public async send(rawNotifications: RawPredefinedNotification[]): Promise<void> {
    if (rawNotifications.length) {
      this.logger.log('Start sending notifications', RawPredefinedNotification.length)
      const notifications = await this.prepareRawNotifications(rawNotifications)
      await this.sendInApp(notifications)
      await this.sendPush(notifications)
    }
  }

  protected async prepareRawNotifications(
    rawNotifications: RawPredefinedNotification[],
  ): Promise<PreparedPredefinedNotification[]> {
    this.logger.log(`Raw notifications - ${rawNotifications.length}`)

    const notificationsUsersIds: string[] = this.clearDuplicateAndEmpty(
      rawNotifications.map((rawNotification) => rawNotification.userId),
    )

    const notificationsUserAppointmentsIds: string[] = this.clearDuplicateAndEmpty(
      rawNotifications.map((rawNotification) => rawNotification.userAppointmentId),
    )

    const notificationsUserProceduresIds: string[] = this.clearDuplicateAndEmpty(
      rawNotifications.map((rawNotification) => rawNotification.userProcedureId),
    )

    this.logger.log(`notificationsUserProceduresIds - ${notificationsUserProceduresIds.length}`)

    const usersMap = mapBy(await this.userEntityRepository.findBy({ id: In(notificationsUsersIds) }), 'id')

    const userAppointmentsMap = mapBy(
      await this.userAppointmentsEntityRepository.findBy({ id: In(notificationsUserAppointmentsIds) }),
      'id',
    )

    const userProceduresMap = mapBy(
      await this.userProceduresEntityRepository.findBy({ id: In(notificationsUserProceduresIds) }),
      'id',
    )

    const notifications: PreparedPredefinedNotification[] = []
    for (const notification of rawNotifications) {
      notifications.push({
        notification: notification.notification,
        user: usersMap[notification.userId],
        ...(notification.userAppointmentId
          ? { userAppointment: userAppointmentsMap[notification.userAppointmentId] }
          : {}),
        ...(notification.userProcedureId ? { userProcedure: userProceduresMap[notification.userProcedureId] } : {}),
        sendStrategy: notification.sendStrategy
          ? notification.sendStrategy
          : [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
      } as PreparedPredefinedNotification)
    }

    this.logger.log(`Total count notifications after deleting all duplicates - ${notifications.length}`)

    return notifications
  }

  protected clearDuplicateAndEmpty<T>(list: Array<T | undefined>): T[] {
    return Array.from(new Set(list.filter((item) => item)))
  }
}
