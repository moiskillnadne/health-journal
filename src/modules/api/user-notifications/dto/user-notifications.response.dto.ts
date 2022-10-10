export class GetUserNotificationDataDto {
  id: string
  videoId: any
  articleId: any
  recipeId: any
  userAppointmentId: string
  procedureId: string
  userProcedureId: string
  isContentValid: string
  isViewed: string
}

export class GetUserNotificationItemsDto {
  title: string
  body: string
  datetime: Date
  ios: {
    categoryId: string
    attachments: any
  }
  android: {
    channelId: string
  }
  data: GetUserNotificationDataDto
}

export class GetUserNotificationsResponseDto {
  date: Date
  items: GetUserNotificationItemsDto[]
}
