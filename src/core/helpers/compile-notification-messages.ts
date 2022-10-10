import { NotificationCustomEntity } from '../../database/entities/notification-custom.entity'
import { MessageParamsDto } from '../../integrations/firebase/firebase.dto'
import { CustomNotificationPushTypes } from '../../constants/enums/notifications.constants'
import { NotificationPredefinedEntity } from '../../database/entities/notification-predefined.entity'

export interface IFormattedNotification {
  recipients: string[]
  message: MessageParamsDto
  originalNotification: NotificationCustomEntity | NotificationPredefinedEntity
}

export const compileCustomNotificationMessages = (
  notifications: NotificationCustomEntity[],
  userIds: string[] | string[][],
): IFormattedNotification[] => {
  return notifications.map((notif, index) => {
    const senderUserIds = (typeof userIds[index] === 'object' ? userIds[index] : userIds) as string[]
    const usersSet: Set<string> = new Set()

    senderUserIds.forEach((userId) => usersSet.add(userId))
    const userIdsWithoutDuplicates = Array.from(usersSet)

    const message = {
      title: notif.name,
      body: notif.contentEn,
      imageId: notif.image && notif.image.id,
      data: {
        type: notif.article
          ? CustomNotificationPushTypes.Article
          : notif.recipe
          ? CustomNotificationPushTypes.Recipe
          : notif.video
          ? CustomNotificationPushTypes.Video
          : CustomNotificationPushTypes.Text,
        payload: {
          id: notif.id,
          ...(notif.article?.id
            ? { articleId: notif.article.id, isContentValid: notif.article.isPublished.toString() }
            : {}),
          ...(notif.recipe?.id
            ? { recipeId: notif.recipe.id, isContentValid: notif.recipe.isPublished.toString() }
            : {}),
          ...(notif.video?.id ? { videoId: notif.video.id, isContentValid: notif.video.isPublished.toString() } : {}),
        },
      },
    }
    return {
      recipients: userIdsWithoutDuplicates,
      message,
      originalNotification: notif,
    }
  })
}

export const compilePredefinedNotificationMessage = (
  notification: NotificationPredefinedEntity,
  userId: string,
  payload: { userAppointmentId?: string; userProcedureId?: string },
): IFormattedNotification => {
  return {
    recipients: [userId],
    message: {
      title: notification.name,
      body: notification.contentEn,
      imageId: null,
      data: {
        type: notification.type,
        payload: {
          id: notification.id,
          userId,
          ...(notification.article?.id
            ? { articleId: notification.article.id, isContentValid: notification.article.isPublished.toString() }
            : {}),
          ...(notification.recipe?.id
            ? { recipeId: notification.recipe.id, isContentValid: notification.recipe.isPublished.toString() }
            : {}),
          ...(notification.video?.id
            ? { videoId: notification.video.id, isContentValid: notification.video.isPublished.toString() }
            : {}),
          ...(notification.procedure?.id ? { procedureId: notification.procedure.id } : {}),
          ...(payload.userAppointmentId ? { userAppointmentId: payload.userAppointmentId } : {}),
          ...(payload.userProcedureId ? { userProcedureId: payload.userProcedureId } : {}),
        },
      },
    },
    originalNotification: notification,
  }
}
