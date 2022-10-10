import { GalleryRecipeEntity } from './../../../../database/entities/gallery-recipe.entity'
import { TrackGroupSchedulePeriod } from '../../../../constants/enums/track.constants'
import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'
import { TrackGroupEntity } from '../../../../database/entities/track-group.entity'
import { TrackEntity } from '../../../../database/entities/track.entity'
import { UserTracksEntity } from '../../../../database/entities/user-tracks.entity'

export const mockTrackEntity: Omit<TrackEntity, 'targetGroups' | 'groups' | 'tracks'> = {
  id: 'unique-track-entity-id',
  createAt: new Date('2022-09-08T16:55:03.242Z'),
  updateAt: new Date('2022-09-08T16:55:03.242Z'),
  titleEn: 'titleen',
  titleSp: 'titleSp',
  isPublished: true,
}

export const mockUserTrackEntity = (assignedAt: Date): Omit<UserTracksEntity, 'user' | 'track'> => ({
  id: 'id',
  createAt: new Date('2022-09-08T16:55:03.242Z'),
  updateAt: new Date('2022-09-08T16:55:03.242Z'),
  userId: 'userId',
  trackId: 'unique-track-entity-id',
  assignedAt,
})

export const mockTrackGroupEntity: Omit<TrackGroupEntity, 'lines' | 'track'> = {
  id: 'group-id',
  createAt: new Date('2022-09-08T16:55:03.242Z'),
  updateAt: new Date('2022-09-08T16:55:03.242Z'),
  trackId: 'unique-track-entity-id',
  order: 1,
  schedule: TrackGroupSchedulePeriod.Daily,
}

export const mockTrackGroupVideoLineEntity = (order: number) => ({
  id: 'some-id',
  createAt: new Date('2022-09-08T16:55:03.242Z'),
  updateAt: new Date('2022-09-08T16:55:03.242Z'),
  video: {
    id: 'video-id',
    titleEn: 'titleen-video',
    isPublished: true,
    videoPreview: {
      bucketKey: '',
      bucketName: '',
    },
    userVideos: [],
  } as GalleryVideoEntity,
  order,
  group: {
    id: 'group-id',
  } as TrackGroupEntity,
})

export const mockTrackGroupArticleLineEntity = (order: number) => ({
  id: 'some-id',
  createAt: new Date('2022-09-08T16:55:03.242Z'),
  updateAt: new Date('2022-09-08T16:55:03.242Z'),
  article: {
    id: 'article-id',
    titleEn: 'titleen-article',
    image: {
      bucketKey: '',
      bucketName: '',
    },
    isPublished: true,
    userArticles: [],
  } as GalleryArticleEntity,
  order,
  group: {
    id: 'group-id',
  } as TrackGroupEntity,
})

export const mockTrackGroupRecipeLineEntity = (order: number) => ({
  id: 'some-id',
  createAt: new Date('2022-09-08T16:55:03.242Z'),
  updateAt: new Date('2022-09-08T16:55:03.242Z'),
  recipe: {
    id: 'recipe-id',
    titleEn: 'titleen-recipe',
    image: {
      bucketKey: '',
      bucketName: '',
    },
    isPublished: true,
    userRecipes: [],
  } as GalleryRecipeEntity,
  order,
  group: {
    id: 'group-id',
  } as TrackGroupEntity,
})
