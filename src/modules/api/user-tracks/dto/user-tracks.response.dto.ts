export class UserTrackVideoDto {
  id: string
  date: Date
  title: string
  preview: string
}

export class GetUserTracksNewContent {
  videos: string[]
  articles: string[]
  recipes: string[]
}

export class GetUserTrackVideosResponseDto {
  id: string
  name: string
  items: UserTrackVideoDto[]
}

export class GetUserTrackArticlesResponseDto extends GetUserTrackVideosResponseDto {}

export class GetUserTrackRecipesResponseDto extends GetUserTrackVideosResponseDto {}
