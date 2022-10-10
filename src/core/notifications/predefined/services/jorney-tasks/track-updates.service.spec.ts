import { Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { createTestingModule } from '../../../../tests/tests.helper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TrackUpdatesService } from './track-updates.service'
import { UserTracksEntity } from '../../../../../database/entities/user-tracks.entity'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { PredefinedNotificationsSendingStrategy } from '../../../notifications.constants'

describe('TrackUpdatesService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userTracksEntityRepositoryMock: jest.Mocked<Repository<UserTracksEntity>>
  let trackUpdatesService: TrackUpdatesService

  beforeEach(async () => {
    const module = await createTestingModule({
      providers: [
        TrackUpdatesService,
        {
          provide: getRepositoryToken(NotificationPredefinedEntity),
          useValue: {
            findOneBy: jest.fn(),
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
    notificationPredefinedEntityRepositoryMock = module.get(getRepositoryToken(NotificationPredefinedEntity))
    trackUpdatesService = module.get<TrackUpdatesService>(TrackUpdatesService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('collectNotifications', () => {
    const getMockPredefinedNotif = (notificationType: NotificationType): NotificationPredefinedEntity =>
      ({
        id: `uuid_predef_notif_mock_type_${notificationType}`,
        type: notificationType,
      } as unknown as NotificationPredefinedEntity)

    const trackIdMock = 'uuid_updated_test_track'
    const usersTracksMock = [
      {
        userId: 'uuid_test_user_1',
        trackId: trackIdMock,
        user: {
          id: 'uuid_test_user_1',
          settingNotifications: {
            newsAndUpdatesEnable: true,
          },
        },
      },
      {
        userId: 'uuid_test_user_2',
        trackId: trackIdMock,
        user: {
          id: 'uuid_test_user_2',
          settingNotifications: {
            newsAndUpdatesEnable: false,
          },
        },
      },
    ] as unknown as UserTracksEntity[]

    it('should collect notifications for updated track', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.TrackTasksUpdated)
      notificationPredefinedEntityRepositoryMock.findOneBy.mockImplementation(async () => notifMock)
      userTracksEntityRepositoryMock.find.mockImplementation(async () => usersTracksMock)
      const result = await trackUpdatesService.collectNotifications(NotificationType.TrackTasksUpdated, trackIdMock)

      expect(userTracksEntityRepositoryMock.find.mock.calls).toEqual([
        [
          {
            where: { trackId: trackIdMock },
            relations: {
              user: { settingNotifications: true },
            },
          },
        ],
      ])

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.push, PredefinedNotificationsSendingStrategy.inApp],
        },
        {
          userId: 'uuid_test_user_2',
          notification: notifMock,
          sendStrategy: [PredefinedNotificationsSendingStrategy.inApp],
        },
      ])
    })
  })
})
