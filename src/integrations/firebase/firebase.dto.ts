export class MessageDataPayloadParamsDto {
  id!: string
  userId?: string
  articleId?: string
  recipeId?: string
  videoId?: string
  procedureId?: string
  appointmentId?: string
  isViewed?: string // "true" | "false"
}

export class MessageDataParamsDto {
  type?: string
  payload!: MessageDataPayloadParamsDto
}

export class MessageParamsDto {
  title!: string
  body!: string
  imageId?: string
  data!: MessageDataParamsDto
}
