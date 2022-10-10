import { Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { createTestingModule } from '../../../../tests/tests.helper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DailyJourneyTaskService } from './daily-journey-task.service'
import { UserTracksEntity } from '../../../../../database/entities/user-tracks.entity'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { TrackGroupSchedulePeriod } from '../../../../../constants/enums/track.constants'
import { PredefinedNotificationsSendingStrategy } from '../../../notifications.constants'

const mockNowDate = new Date(2022, 8, 1, 12, 7, 16) // 2022-09-01 12:07:16 GMT

describe('DailyJourneyTaskService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userEntityRepositoryMock: jest.Mocked<Repository<UserEntity>>
  let userTracksEntityRepositoryMock: jest.Mocked<Repository<UserTracksEntity>>
  let dailyJourneyTaskService: DailyJourneyTaskService

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(mockNowDate)
    const module = await createTestingModule({
      providers: [
        DailyJourneyTaskService,
        {
          provide: getRepositoryToken(NotificationPredefinedEntity),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserTracksEntity),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    })

    userTracksEntityRepositoryMock = module.get(getRepositoryToken(UserTracksEntity))
    userEntityRepositoryMock = module.get(getRepositoryToken(UserEntity))
    notificationPredefinedEntityRepositoryMock = module.get(getRepositoryToken(NotificationPredefinedEntity))
    dailyJourneyTaskService = module.get<DailyJourneyTaskService>(DailyJourneyTaskService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('collectNotifications', () => {
    const getMockPredefinedNotif = (notificationType: NotificationType): NotificationPredefinedEntity =>
      ({
        id: `uuid_predef_notif_mock_type_${notificationType}`,
        type: notificationType,
      } as unknown as NotificationPredefinedEntity)

    const usersDisbledNotificationMock = [
      {
        id: 'uuid_test_user_1_disabled_notification',
      },
      {
        id: 'uuid_test_user_2_disabled_notification',
      },
      {
        id: 'uuid_test_user_3_disabled_notification',
      },
    ] as unknown as UserEntity[]

    const userTracksMock = [
      {
        //user with first day task
        // won't be included to result
        userId: 'uuid_test_user_1',
        assignedAt: new Date(2022, 8, 1), //2022-09-01 - today
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.Daily,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        //user with daily track task on the second day
        // will be included to result (push, in-app)
        userId: 'uuid_test_user_2',
        assignedAt: new Date(2022, 7, 31), //2022-08-31 - yesterday
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.Daily,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        //user with daily track task on the second day and disabled notifcation setting
        // will be included to result (in-app)
        userId: 'uuid_test_user_3_disabled_notification',
        assignedAt: new Date(2022, 7, 31), //2022-08-31 - yesterday
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.Daily,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        //user with track task on the third day
        // will be included to result (push, in-app)
        userId: 'uuid_test_user_4',
        assignedAt: new Date(2022, 7, 29), //2022-08-29
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.OncePerThreeDays,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        //user with track task on the seventh day
        // will be included to result (push, in-app)
        userId: 'uuid_test_user_5',
        assignedAt: new Date(2022, 7, 25), //2022-08-25
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.OncePerSevenDays,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        //user with track task on the 14 day
        // will be included to result (push, in-app)
        userId: 'uuid_test_user_6',
        assignedAt: new Date(2022, 7, 18), //2022-08-18
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.OncePerFourteenDays,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        //user with track task on the 1 month
        // will be included to result (push, in-app)
        userId: 'uuid_test_user_7',
        assignedAt: new Date(2022, 7, 1), //2022-08-01
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.OncePerThirtyDays,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        // user with daily track task on the second day and track line without gallery items
        // won't be included to result
        userId: 'uuid_test_user_8_with_track_line_without_gallery_items',
        assignedAt: new Date(2022, 7, 31), //2022-08-31
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.Daily,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                },
              ],
            },
          ],
        },
      },
      {
        // user with daily track task on the second day and track line with unpublished gallery items
        // won't be included to result
        userId: 'uuid_test_user_8_with_track_line_with_unpublished_gallery_items',
        assignedAt: new Date(2022, 7, 31), //2022-08-31
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.Daily,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: false,
                  },
                  article: {
                    isPublished: false,
                  },
                  recipe: {
                    isPublished: false,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        // user with daily track task from 2 different tracks (and next record)
        // The only one notification will be included in the result
        userId: 'uuid_test_user_9_with_2_track_new_tasks',
        assignedAt: new Date(2022, 7, 31), //2022-08-31
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.Daily,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        userId: 'uuid_test_user_9_with_2_track_new_tasks',
        assignedAt: new Date(2022, 7, 29), //2022-08-29
        track: {
          groups: [
            {
              schedule: TrackGroupSchedulePeriod.OncePerThreeDays,
              lines: [
                {
                  order: 1,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
                {
                  order: 2,
                  video: {
                    isPublished: true,
                  },
                  article: {
                    isPublished: true,
                  },
                  recipe: {
                    isPublished: true,
                  },
                },
              ],
            },
          ],
        },
      },
    ] as unknown as UserTracksEntity[]

    it('should collect notifications for daily tasks', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.TrackTasksAssigned)
      notificationPredefinedEntityRepositoryMock.findOneBy.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersDisbledNotificationMock)
      userTracksEntityRepositoryMock.find.mockImplementation(async () => userTracksMock)

      const result = await dailyJourneyTaskService.collectNotifications(NotificationType.TrackTasksAssigned)

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_2',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_3_disabled_notification',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_4',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_5',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_6',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_7',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_9_with_2_track_new_tasks',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
      ])
    })
  })
})
