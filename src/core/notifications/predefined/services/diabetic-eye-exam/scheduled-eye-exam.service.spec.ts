import { Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { createTestingModule } from '../../../../tests/tests.helper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ScheduledEyeExamService } from './scheduled-eye-exam.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'

const mockNowDate = new Date(2022, 8, 1, 12, 7, 16) // 2022-09-01 12:07:16 GMT

describe('ScheduledEyeExamService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userEntityRepositoryMock: jest.Mocked<Repository<UserEntity>>
  let scheduledEyeExamService: ScheduledEyeExamService

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(mockNowDate)
    const module = await createTestingModule({
      providers: [
        ScheduledEyeExamService,
        {
          provide: getRepositoryToken(NotificationPredefinedEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    })
    userEntityRepositoryMock = module.get(getRepositoryToken(UserEntity))
    notificationPredefinedEntityRepositoryMock = module.get(getRepositoryToken(NotificationPredefinedEntity))
    scheduledEyeExamService = module.get<ScheduledEyeExamService>(ScheduledEyeExamService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('collectNotifications', () => {
    const getMockPredefinedNotif = (notificationType: NotificationType): NotificationPredefinedEntity =>
      ({
        id: `uuid_predef_notif_mock_type_${notificationType}`,
        type: notificationType,
      } as unknown as NotificationPredefinedEntity)

    const usersMock = [
      {
        id: 'uuid_test_user_1',
        procedures: [
          {
            id: 'uuid_test_user_1_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_1_procedure_2',
            datetime: new Date(2022, 7, 28), // (2022-08-28) 4 day ago
          },
          {
            id: 'uuid_test_user_1_procedure_3',
            datetime: new Date(2022, 7, 29), // (2022-08-29) 3 day ago
          },
          {
            id: 'uuid_test_user_1_procedure_4',
            datetime: new Date(2022, 7, 31), // (2022-08-31) 1 day ago
          },
          {
            id: 'uuid_test_user_1_procedure_5',
            datetime: new Date(2022, 8, 3), // (2022-09-03) in 2 days
          },
          {
            id: 'uuid_test_user_1_procedure_6',
            datetime: new Date(2022, 8, 8), // (2022-09-08) in 1 week
          },
          {
            id: 'uuid_test_user_1_procedure_7',
            datetime: new Date(2022, 8, 15), // (2022-09-15) in 2 week
          },
          {
            id: 'uuid_test_user_1_procedure_8',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_2_without_procedures',
        procedures: [],
      },
      {
        id: 'uuid_test_user_3',
        procedures: [
          {
            id: 'uuid_test_user_3_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_3_procedure_2',
            datetime: new Date(2022, 7, 29), // (2022-08-29) 3 day ago
          },
          {
            id: 'uuid_test_user_3_procedure_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_4',
        procedures: [
          {
            id: 'uuid_test_user_4_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_4_procedure_2',
            datetime: new Date(2022, 7, 31), // (2022-08-31) 1 day ago
          },
          {
            id: 'uuid_test_user_4_procedure_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_5',
        procedures: [
          {
            id: 'uuid_test_user_5_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_5_procedure_2',
            datetime: new Date(2022, 8, 3), // (2022-09-03) in 2 days
          },
          {
            id: 'uuid_test_user_5_procedure_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_6',
        procedures: [
          {
            id: 'uuid_test_user_6_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_6_procedure_2',
            datetime: new Date(2022, 8, 8), // (2022-09-08) in 1 week
          },
          {
            id: 'uuid_test_user_6_procedure_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_7',
        procedures: [
          {
            id: 'uuid_test_user_7_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_7_procedure_2',
            datetime: new Date(2022, 8, 15), // (2022-09-15) in 2 week
          },
          {
            id: 'uuid_test_user_7_procedure_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
    ] as unknown as UserEntity[]

    it('should collect notifications for procedures that where 1 day ago', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DiabeticEyeExamOneDayAgo)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledEyeExamService.collectNotifications(NotificationType.DiabeticEyeExamOneDayAgo)
      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_1_procedure_4',
        },
        {
          userId: 'uuid_test_user_4',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_4_procedure_2',
        },
      ])
    })

    it('should collect notifications for procedures that will be in 2 days', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DiabeticEyeExamInTwoDays)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledEyeExamService.collectNotifications(NotificationType.DiabeticEyeExamInTwoDays)

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_1_procedure_5',
        },
        {
          userId: 'uuid_test_user_5',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_5_procedure_2',
        },
      ])
    })

    it('should collect notifications for procedures that will be in 2 weeks', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DiabeticEyeExamInTwoWeeks)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledEyeExamService.collectNotifications(NotificationType.DiabeticEyeExamInTwoWeeks)

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_1_procedure_7',
        },
        {
          userId: 'uuid_test_user_7',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_7_procedure_2',
        },
      ])
    })
  })
})
