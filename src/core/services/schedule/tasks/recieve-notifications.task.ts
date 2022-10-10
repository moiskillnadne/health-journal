import { Logger } from '@nestjs/common'
import { CustomNotificationSendingStrategy } from '../../../../constants/enums/notifications.constants'
import { FirebaseService } from '../../../../integrations/firebase/firebase.service'
import { NotificationCustomCrud } from '../../../../modules/api/admin/notification/crud/notification-custom.crud'
import { UserNotificationsCrudService } from '../../../../modules/api/user-notifications/user-notifications.crud'
import { UserTargetGroupsCrudService } from '../../../../modules/api/user-target-groups/user-target-groups.crud'
import {
  compileCustomNotificationMessages,
  IFormattedNotification,
} from '../../../helpers/compile-notification-messages'
import { NotificationCustomEntity } from '../../../../database/entities/notification-custom.entity'

export const sendCustomNotifications = async (
  notificationCrudService: NotificationCustomCrud,
  userTargetGroupCrudService: UserTargetGroupsCrudService,
  firebaseService: FirebaseService,
  userNotificationCrudService: UserNotificationsCrudService,
) => {
  const logger = new Logger('Processing Scheduled Notifications')

  // Get all scheduled notifications which has today date
  const notifications = await notificationCrudService.getItemsByFilterParams({
    sending_strategy: CustomNotificationSendingStrategy.Scheduled,
    isToday: true,
  })

  logger.log(`Found notifications for today: ${notifications.totalCount}`)

  // Get all target group ids which notification related with
  const targetGroupIds = notifications.entities.map((notification) =>
    notification.targetGroups.map((targetGroup) => targetGroup.id),
  )

  // Find all users in UserTargetGroupsEntity by current target group
  const usersByTargetGroup = await Promise.all(
    targetGroupIds.map((group) => userTargetGroupCrudService.getUsersByTargetGroupIds(group)),
  )

  const userIds = usersByTargetGroup.map((usersGroup) => usersGroup.map((user) => user.userId))

  // Formated and applied it between each other in notification message
  const formatedNotifications: IFormattedNotification[] = compileCustomNotificationMessages(
    notifications.entities,
    userIds,
  )

  logger.log(`Total notifications prepared for sending: ${formatedNotifications.length}`)

  // Create array of send notification promises
  const sendNotificationPromises = formatedNotifications.map(async (notification) =>
    firebaseService.sendNotification(notification.recipients, notification.message),
  )

  // Send all notifications
  const result = await Promise.all(sendNotificationPromises)

  // Filter sent result and map to formatted notifications
  const successSentNotifications: IFormattedNotification[] = result.reduce((acc, sendingResult, index) => {
    if (sendingResult.successCount > 0) {
      acc.push(formatedNotifications[index])
    }

    return acc
  }, [])

  logger.log(`Total successfully sent notifications: ${successSentNotifications.length}`)

  // Create user custom notifications based on success sent notifications for each recipient
  const successUserCustomNotifications = formatedNotifications.reduce((acc, formattedNotif) => {
    const recipients = formattedNotif.recipients
    const originalNotification = formattedNotif.originalNotification as NotificationCustomEntity

    recipients.forEach((recipId) => {
      acc.push({
        userId: recipId,
        notificationId: originalNotification.id,
        title: originalNotification.name,
        bodyEn: originalNotification.contentEn,
        bodySp: originalNotification.contentSp,
        image: originalNotification.image,
        video: originalNotification.video,
        article: originalNotification.article,
        recipe: originalNotification.recipe,
      })
    })

    return acc
  }, [])

  // Save
  await userNotificationCrudService.saveUserCustomNotification(successUserCustomNotifications)

  logger.log('Processing Scheduled Notifications Finished')
}
