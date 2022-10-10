import { NotificationCustomEntity } from '../../../database/entities/notification-custom.entity'
import { compileCustomNotificationMessages } from '../../helpers/compile-notification-messages'
import { Injectable } from '@nestjs/common'
import { FirebaseService } from '../../../integrations/firebase/firebase.service'
import { UserNotificationsCrudService } from '../../../modules/api/user-notifications/user-notifications.crud'
import { InjectRepository } from '@nestjs/typeorm'
import { UserTargetGroupsEntity } from '../../../database/entities/user-target-groups.entity'
import { In, Repository } from 'typeorm'

@Injectable()
export class SendNotificationsService {
  constructor(
    @InjectRepository(UserTargetGroupsEntity)
    protected userTargetGroupsRepository: Repository<UserTargetGroupsEntity>,
    private firebaseService: FirebaseService,
    private userNotificationCrudService: UserNotificationsCrudService,
  ) {}

  public async sendImmediately(notification: NotificationCustomEntity) {
    const targetGroupIds = notification.targetGroups.map((group) => group.id)

    const userByTargetGroup = await this.userTargetGroupsRepository.find({
      where: {
        targetGroupId: In(targetGroupIds),
      },
    })

    const userIds = userByTargetGroup.map((user) => user.userId)

    const formatedNotifications = compileCustomNotificationMessages([notification], userIds)
    const formattedNotification = formatedNotifications[0] // Always will first index

    await this.firebaseService.sendNotification(formattedNotification.recipients, formattedNotification.message)

    const recipientIds = formattedNotification.recipients

    const userCustomNotifications = recipientIds.map((recipId) => ({
      userId: recipId,
      notificationId: notification.id,
      title: notification.name,
      bodyEn: notification.contentEn,
      bodySp: notification.contentSp,
      image: notification.image,
      video: notification.video,
      article: notification.article,
      recipe: notification.recipe,
    }))

    await this.userNotificationCrudService.saveUserCustomNotification(userCustomNotifications)
  }
}
