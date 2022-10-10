export class GetUserVitalsNewContent {
  videos: boolean
  articles: boolean
}

export class GetUserVitalVideosResponseDto {
  id: string
  title: string
  preview: string
}

export class GetUserVitalArticlesResponseDto extends GetUserVitalVideosResponseDto {}
