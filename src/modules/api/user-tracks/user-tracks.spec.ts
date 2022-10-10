import { UserTargetGroupsEntity } from './../../../database/entities/user-target-groups.entity'
import { I18nContext } from 'nestjs-i18n'
import { addDays, addMonths, addWeeks, subDays } from 'date-fns'
import { TrackGroupSchedulePeriod } from '../../../constants/enums/track.constants'
import { UserArticlesEntity } from '../../../database/entities/user-articles.entity'
import { UserTracksEntity } from '../../../database/entities/user-tracks.entity'
import { UserVideosEntity } from '../../../database/entities/user-videos.entity'
import { createTestingModule } from './../../../core/tests/tests.helper'
import {
  mockTrackEntity,
  mockTrackGroupArticleLineEntity,
  mockTrackGroupEntity,
  mockTrackGroupRecipeLineEntity,
  mockTrackGroupVideoLineEntity,
  mockUserTrackEntity,
} from './mocks/track.mock'
import { UserTracksCrudService } from './user-tracks.crud'
import {
  getNextDateBySchedulePeriod,
  getTodayTrackGroupsLinesWithoutFirstDay,
  getUserArticleFlags,
  getUserTrackGroupLines,
  getUserTrackLines,
  getUserTrackLinesContent,
  getUserTracksContent,
  getUserVideoFlags,
} from './user-tracks.helper'
import { UserTracksService } from './user-tracks.service'
import { UserCrudService } from '../user/user.crud'
import { UserEntity } from '../../../database/entities/user.entity'
import { TrackEntity } from '../../../database/entities/track.entity'
import { TrackCrud } from '../admin/track/crud/track.crud'
import { TargetGroupEntity } from '../../../database/entities/target-group.entity'

describe('UserTracksService', () => {
  const mockTrack = (assignedAtYesterday: Date) =>
    ({
      ...mockUserTrackEntity(assignedAtYesterday),
      track: {
        ...mockTrackEntity,
        groups: [
          {
            ...mockTrackGroupEntity,
            lines: [
              mockTrackGroupVideoLineEntity(1),
              mockTrackGroupArticleLineEntity(2),
              mockTrackGroupRecipeLineEntity(3),
              mockTrackGroupVideoLineEntity(4),
            ],
          },
        ],
      },
    } as UserTracksEntity)

  describe('helpers', () => {
    describe('getUserTrackGroupLines', () => {
      it('should return TWO track group lines', () => {
        const assignedAtYesterday = subDays(new Date(), 1)

        const result = getUserTrackGroupLines(
          [mockTrackGroupVideoLineEntity(1), mockTrackGroupVideoLineEntity(2), mockTrackGroupVideoLineEntity(3)],
          TrackGroupSchedulePeriod.Daily,
          assignedAtYesterday,
        )

        expect(result).toEqual([
          { ...mockTrackGroupVideoLineEntity(1), date: assignedAtYesterday },
          {
            ...mockTrackGroupVideoLineEntity(2),
            date: addDays(
              new Date(
                assignedAtYesterday.getFullYear(),
                assignedAtYesterday.getMonth(),
                assignedAtYesterday.getDate(),
              ),
              1,
            ),
          },
        ])
      })

      it('should return ONE track group line', () => {
        const assignedAtYesterday = subDays(new Date(), 1)

        const result = getUserTrackGroupLines(
          [mockTrackGroupVideoLineEntity(1), mockTrackGroupVideoLineEntity(2), mockTrackGroupVideoLineEntity(3)],
          TrackGroupSchedulePeriod.OncePerThreeDays,
          assignedAtYesterday,
        )

        expect(result).toEqual([{ ...mockTrackGroupVideoLineEntity(1), date: assignedAtYesterday }])
      })
    })

    describe('getNextDateBySchedulePeriod', () => {
      it('should return tomorrow', () => {
        const today = new Date()
        const schedule = TrackGroupSchedulePeriod.Daily

        const result = getNextDateBySchedulePeriod(
          schedule,
          new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        )

        expect(result).toEqual(addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 1))
      })

      it('should return third day', () => {
        const today = new Date()
        const schedule = TrackGroupSchedulePeriod.OncePerThreeDays

        const result = getNextDateBySchedulePeriod(
          schedule,
          new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        )

        expect(result).toEqual(addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 3))
      })

      it('should return seventh day', () => {
        const today = new Date()
        const schedule = TrackGroupSchedulePeriod.OncePerSevenDays

        const result = getNextDateBySchedulePeriod(
          schedule,
          new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        )

        expect(result).toEqual(addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 7))
      })

      it('should return fourteenth day', () => {
        const today = new Date()
        const schedule = TrackGroupSchedulePeriod.OncePerFourteenDays

        const result = getNextDateBySchedulePeriod(
          schedule,
          new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        )

        expect(result).toEqual(addWeeks(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 2))
      })

      it('should return thirtieth day', () => {
        const today = new Date()
        const schedule = TrackGroupSchedulePeriod.OncePerThirtyDays

        const result = getNextDateBySchedulePeriod(
          schedule,
          new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        )

        expect(result).toEqual(addMonths(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 1))
      })
    })

    describe('getTodayTrackGroupsLinesWithoutFirstDay', () => {
      it('should return track group without first day', () => {
        const assignedAtYesterday = subDays(new Date(), 1)

        const result = getTodayTrackGroupsLinesWithoutFirstDay(
          [mockTrackGroupVideoLineEntity(1), mockTrackGroupVideoLineEntity(2), mockTrackGroupVideoLineEntity(3)],
          TrackGroupSchedulePeriod.Daily,
          assignedAtYesterday,
        )

        expect(result).toEqual([
          {
            ...mockTrackGroupVideoLineEntity(2),
            date: addDays(
              new Date(
                assignedAtYesterday.getFullYear(),
                assignedAtYesterday.getMonth(),
                assignedAtYesterday.getDate(),
              ),
              1,
            ),
          },
        ])
      })
    })

    describe('getUserTrackLines', () => {
      it('should return user track lines', () => {
        const assignedAtYesterday = subDays(new Date(), 1)

        const result = getUserTrackLines(mockTrack(assignedAtYesterday))

        expect(result).toEqual([
          { ...mockTrackGroupVideoLineEntity(1), date: assignedAtYesterday },
          {
            ...mockTrackGroupArticleLineEntity(2),
            date: addDays(
              new Date(
                assignedAtYesterday.getFullYear(),
                assignedAtYesterday.getMonth(),
                assignedAtYesterday.getDate(),
              ),
              1,
            ),
          },
        ])
      })
    })

    describe('getUserTrackLinesContent', () => {
      const assignedAtTwoDaysAgo = subDays(new Date(), 2)

      const mockLines = [
        { ...mockTrackGroupVideoLineEntity(1), date: assignedAtTwoDaysAgo },
        {
          ...mockTrackGroupArticleLineEntity(2),
          date: addDays(
            new Date(
              assignedAtTwoDaysAgo.getFullYear(),
              assignedAtTwoDaysAgo.getMonth(),
              assignedAtTwoDaysAgo.getDate(),
            ),
            1,
          ),
        },
        {
          ...mockTrackGroupRecipeLineEntity(3),
          date: addDays(
            new Date(
              assignedAtTwoDaysAgo.getFullYear(),
              assignedAtTwoDaysAgo.getMonth(),
              assignedAtTwoDaysAgo.getDate(),
            ),
            2,
          ),
        },
      ]

      it('should return one video line', () => {
        const mockOption = 'video'
        const result = getUserTrackLinesContent(mockLines, mockOption)

        expect(result).toEqual([{ ...mockTrackGroupVideoLineEntity(1), date: assignedAtTwoDaysAgo }])
      })

      it('should return one article line', () => {
        const mockOption = 'article'
        const result = getUserTrackLinesContent(mockLines, mockOption)

        expect(result).toEqual([
          {
            ...mockTrackGroupArticleLineEntity(2),
            date: addDays(
              new Date(
                assignedAtTwoDaysAgo.getFullYear(),
                assignedAtTwoDaysAgo.getMonth(),
                assignedAtTwoDaysAgo.getDate(),
              ),
              1,
            ),
          },
        ])
      })

      it('should return one recipe line', () => {
        const mockOption = 'recipe'
        const result = getUserTrackLinesContent(mockLines, mockOption)

        expect(result).toEqual([
          {
            ...mockTrackGroupRecipeLineEntity(3),
            date: addDays(
              new Date(
                assignedAtTwoDaysAgo.getFullYear(),
                assignedAtTwoDaysAgo.getMonth(),
                assignedAtTwoDaysAgo.getDate(),
              ),
              2,
            ),
          },
        ])
      })
    })

    describe('getUserTracksContent', () => {
      const assignedAtTwoDaysAgo = subDays(new Date(), 2)
      const mockOption = 'video'
      const mockLang = 'en'

      it('should return user tracks content with one video', () => {
        const track = mockTrack(assignedAtTwoDaysAgo)

        const result = getUserTracksContent([track], mockOption, mockLang)

        expect(result).toEqual([
          {
            id: track.track.id,
            name: track.track.titleEn,
            items: [{ ...mockTrackGroupVideoLineEntity(1), date: assignedAtTwoDaysAgo }],
          },
        ])
      })
    })

    describe('getUserVideoFlags', () => {
      const mockUserVideoRelation = {
        isFavorite: true,
        isVisited: true,
        isViewed: false,
        userId: 'userId',
      } as UserVideosEntity

      it('should return actual boolean values', () => {
        const userId = 'userId'

        const result = getUserVideoFlags(userId, [mockUserVideoRelation])

        expect(result).toEqual({ isFavorite: true, isVisited: true, isViewed: false })
      })

      it('should return false values', () => {
        const userId = 'wrong-userId'

        const result = getUserVideoFlags(userId, [mockUserVideoRelation])

        expect(result).toEqual({ isFavorite: false, isVisited: false, isViewed: false })
      })
    })

    describe('getUserArticleFlags', () => {
      const mockUserArticleRelation = { isFavorite: false, isVisited: true, userId: 'userId' } as UserArticlesEntity

      it('should return actual boolean values', () => {
        const userId = 'userId'

        const result = getUserArticleFlags(userId, [mockUserArticleRelation])

        expect(result).toEqual({ isFavorite: false, isVisited: true })
      })

      it('should return false values', () => {
        const userId = 'wrong-userId'

        const result = getUserArticleFlags(userId, [mockUserArticleRelation])

        expect(result).toEqual({ isFavorite: false, isVisited: false })
      })
    })
  })

  describe('UserTracksService', () => {
    let userTracksService: UserTracksService
    let userTracksCrudService: jest.Mocked<UserTracksCrudService>
    let userCrudService: jest.Mocked<UserCrudService>
    let trackCrudService: jest.Mocked<TrackCrud>

    beforeEach(async () => {
      const module = await createTestingModule({
        providers: [UserTracksService],
      })

      userTracksService = module.get<UserTracksService>(UserTracksService)
      userTracksCrudService = module.get<UserTracksCrudService, jest.Mocked<UserTracksCrudService>>(
        UserTracksCrudService,
      )
      userCrudService = module.get<UserCrudService, jest.Mocked<UserCrudService>>(UserCrudService)
      trackCrudService = module.get<TrackCrud, jest.Mocked<TrackCrud>>(TrackCrud)
    })

    describe('getUserTracksNewContentByUserId', () => {
      it('should return one video line', async () => {
        const assignedAtYesterday = subDays(new Date(), 1)

        userTracksCrudService.getUserTracksByParams.mockResolvedValue([mockTrack(assignedAtYesterday)])

        const result = await userTracksService.getUserTracksNewContentByUserId('userid')

        const mockResult = {
          videos: ['unique-track-entity-id'],
          articles: ['unique-track-entity-id'],
          recipes: [],
        }

        expect(result).toEqual(mockResult)
      })
    })

    describe('getUserTrackVideosByUserId', () => {
      const assignedAtYesterday = subDays(new Date(), 1)
      const userId = 'userId'

      const mockedTrack = mockTrack(assignedAtYesterday)

      it('should return array with one video track', async () => {
        userTracksCrudService.getUserTracksByParams.mockResolvedValue([mockedTrack])
        const result = await userTracksService.getUserTrackVideosByUserId(userId, { lang: 'en' } as I18nContext)

        const mockTrackVideo = mockTrackGroupVideoLineEntity(1)
        const expectedResult = [
          {
            id: mockedTrack.track.id,
            name: mockedTrack.track.titleEn,
            items: [
              {
                id: mockTrackVideo.video.id,
                date: assignedAtYesterday,
                title: mockTrackVideo.video.titleEn,
                preview: undefined,
                isFavorite: false,
                isVisited: false,
                isViewed: false,
              },
            ],
          },
        ]
        expect(result).toEqual(expectedResult)
      })
    })

    describe('getUserTrackArticlesByUserId', () => {
      const assignedAtYesterday = subDays(new Date(), 1)
      const userId = 'userId'

      const mockedTrack = mockTrack(assignedAtYesterday)

      it('should return array with one article track', async () => {
        userTracksCrudService.getUserTracksByParams.mockResolvedValue([mockedTrack])
        const result = await userTracksService.getUserTrackArticlesByUserId(userId, { lang: 'en' } as I18nContext)

        const mockTrackArticle = mockTrackGroupArticleLineEntity(2)
        const expectedResult = [
          {
            id: mockedTrack.track.id,
            name: mockedTrack.track.titleEn,
            items: [
              {
                id: mockTrackArticle.article.id,
                date: addDays(
                  new Date(
                    assignedAtYesterday.getFullYear(),
                    assignedAtYesterday.getMonth(),
                    assignedAtYesterday.getDate(),
                  ),
                  1,
                ),
                title: mockTrackArticle.article.titleEn,
                preview: undefined,
                isFavorite: false,
                isVisited: false,
              },
            ],
          },
        ]
        expect(result).toEqual(expectedResult)
      })
    })

    describe('getUserTrackRecipesByUserId', () => {
      const assignedAtTwoDaysAgo = subDays(new Date(), 2)
      const userId = 'userId'

      const mockedTrack = mockTrack(assignedAtTwoDaysAgo)
      it('should return array with one recipe track', async () => {
        userTracksCrudService.getUserTracksByParams.mockResolvedValue([mockedTrack])
        const result = await userTracksService.getUserTrackRecipesByUserId(userId, { lang: 'en' } as I18nContext)

        const mockTrackRecipe = mockTrackGroupRecipeLineEntity(3)
        const expectedResult = [
          {
            id: mockedTrack.track.id,
            name: mockedTrack.track.titleEn,
            items: [
              {
                id: mockTrackRecipe.recipe.id,
                date: addDays(
                  new Date(
                    assignedAtTwoDaysAgo.getFullYear(),
                    assignedAtTwoDaysAgo.getMonth(),
                    assignedAtTwoDaysAgo.getDate(),
                  ),
                  2,
                ),
                title: mockTrackRecipe.recipe.titleEn,
                preview: undefined,
                isFavorite: false,
                isVisited: false,
              },
            ],
          },
        ]
        expect(result).toEqual(expectedResult)
      })
    })

    describe('assignUserTracksByUserId', () => {
      const assignedAtYesterday = subDays(new Date(), 1)

      const mockUserId = 'userid'

      const mockTrackEntity = {
        id: 'trackid',
        titleEn: 'titleen-track',
        isPublished: true,
      } as TrackEntity

      const mockUserWithRelations = (assignedUserTrack: UserTracksEntity) => {
        return {
          id: mockUserId,
          targetGroups: [
            {
              userId: 'userid',
              targetGroup: {
                tracks: [mockTrackEntity],
              },
            } as UserTargetGroupsEntity,
          ],
          tracks: [assignedUserTrack],
        } as UserEntity
      }

      const mockedUserTrack = {
        userId: mockUserId,
        trackId: mockTrackEntity.id,
      } as UserTracksEntity

      it('should return array with assigned user tracks', async () => {
        const mockAssignedUserTrack = {
          userId: 'userid',
          trackId: 'another-trackid',
          assignedAt: assignedAtYesterday,
        } as UserTracksEntity

        userCrudService.getUserByIdWithRelations.mockResolvedValue(mockUserWithRelations(mockAssignedUserTrack))
        userTracksCrudService.addUserTrackByParams.mockResolvedValue(mockedUserTrack)

        const result = await userTracksService.assignUserTracksByUserId(mockUserId)

        expect(userCrudService.getUserByIdWithRelations).toBeCalledTimes(1)
        expect(userTracksCrudService.addUserTrackByParams).toBeCalledTimes(1)
        expect(userTracksCrudService.addUserTrackByParams).toBeCalledWith(mockUserId, {
          trackId: mockTrackEntity.id,
        })
        expect(result).toEqual([mockedUserTrack])
      })

      it('should return empty array', async () => {
        const mockAssignedUserTrack = {
          userId: 'userid',
          trackId: mockTrackEntity.id,
          assignedAt: assignedAtYesterday,
        } as UserTracksEntity

        userCrudService.getUserByIdWithRelations.mockResolvedValue(mockUserWithRelations(mockAssignedUserTrack))
        userTracksCrudService.addUserTrackByParams.mockResolvedValue(mockedUserTrack)

        const result = await userTracksService.assignUserTracksByUserId(mockUserId)

        expect(userCrudService.getUserByIdWithRelations).toBeCalledTimes(1)
        expect(userTracksCrudService.addUserTrackByParams).toBeCalledTimes(0)
        expect(result).toEqual([])
      })
    })

    describe('assignTracksToUsersByTrackId', () => {
      const assignedAtYesterday = subDays(new Date(), 1)
      const assignedToday = new Date()

      const mockTargetGroup = {
        id: 'mocktargetgroup',
        title: 'targetgroup',
      } as TargetGroupEntity

      const mockTrackEntity = {
        id: 'mocktrackentity',
        titleEn: 'titleen',
        isPublished: true,
        targetGroups: [mockTargetGroup],
      } as TrackEntity

      const mockUserId = 'userid'
      const mockUser = {
        id: mockUserId,
        targetGroups: [{ targetGroupId: mockTargetGroup.id, userId: mockUserId } as UserTargetGroupsEntity],
        tracks: [{ userId: mockUserId, trackId: 'trackid', assignedAt: assignedAtYesterday } as UserTracksEntity],
      } as UserEntity

      const mockAssignedUserTrackEntity = {
        userId: mockUserId,
        trackId: 'mockNewTrackId',
        assignedAt: assignedToday,
      } as UserTracksEntity

      it('should return one assigned user track', async () => {
        const mockNewTrackId = 'new-track-id'

        trackCrudService.getTrackById.mockResolvedValue(mockTrackEntity)
        userCrudService.getUsersByParams.mockResolvedValue([mockUser])
        userTracksCrudService.addUserTrackByParams.mockResolvedValue(mockAssignedUserTrackEntity)

        const result = await userTracksService.assignTracksToUsersByTrackId(mockNewTrackId)

        expect(trackCrudService.getTrackById).toBeCalledTimes(1)
        expect(trackCrudService.getTrackById).toBeCalledWith(mockNewTrackId, ['targetGroups'])
        expect(userCrudService.getUsersByParams).toBeCalledTimes(1)
        expect(userTracksCrudService.addUserTrackByParams).toBeCalledTimes(1)
        expect(userTracksCrudService.addUserTrackByParams).toBeCalledWith(mockUserId, { trackId: mockNewTrackId })
        expect(result).toEqual([mockAssignedUserTrackEntity])
      })

      it('should return empty array', async () => {
        const mockNewTrackId = 'trackid'

        trackCrudService.getTrackById.mockResolvedValue(mockTrackEntity)
        userCrudService.getUsersByParams.mockResolvedValue([mockUser])
        userTracksCrudService.addUserTrackByParams.mockResolvedValue(mockAssignedUserTrackEntity)

        const result = await userTracksService.assignTracksToUsersByTrackId(mockNewTrackId)

        expect(trackCrudService.getTrackById).toBeCalledTimes(1)
        expect(trackCrudService.getTrackById).toBeCalledWith(mockNewTrackId, ['targetGroups'])
        expect(userCrudService.getUsersByParams).toBeCalledTimes(1)
        expect(userTracksCrudService.addUserTrackByParams).toBeCalledTimes(0)
        expect(result).toEqual([])
      })
    })
  })
})
