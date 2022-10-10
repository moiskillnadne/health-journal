import { Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { createTestingModule } from '../../../../tests/tests.helper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ToExpireEyeExamService } from './to-expire-eye-exam.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'

const mockNowDate = new Date(2022, 8, 1, 12, 7, 16) // 2022-09-01 12:07:16 GMT

describe('ToExpireEyeExamService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userEntityRepositoryMock: jest.Mocked<Repository<UserEntity>>
  let toExpireEyeExamService: ToExpireEyeExamService

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(mockNowDate)
    const module = await createTestingModule({
      providers: [
        ToExpireEyeExamService,
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
    toExpireEyeExamService = module.get<ToExpireEyeExamService>(ToExpireEyeExamService)
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
        // user have not eye exams and have not reminders
        //won't be included in the result
        id: 'uuid_test_user_1',
        procedures: [],
        reminders: [],
      },
      {
        // user had eye exams (not 11 month ago) and have not reminders
        //won't be included in the result
        id: 'uuid_test_user_2',
        procedures: [
          {
            id: 'uuid_test_user_2_procedure_1',
            datetime: new Date(2022, 5, 1), // (2022-06-01) 3 months ago
          },
        ],
        reminders: [],
      },
      {
        // user had eye exams in the past 11 month ago and eye exams after that and have not reminders
        //won't be included in the result
        id: 'uuid_test_user_3',
        procedures: [
          {
            id: 'uuid_test_user_3_procedure_1',
            datetime: new Date(2021, 9, 1), // (2021-10-01) 11 months ago
          },
          {
            id: 'uuid_test_user_3_procedure_2',
            datetime: new Date(2022, 5, 1), // (2022-06-01) 3 months ago
          },
        ],
        reminders: [],
      },
      {
        // user had eye exam 11 month ago and no eye exams after that and have not reminders
        //will be included in the result
        id: 'uuid_test_user_4',
        procedures: [
          {
            id: 'uuid_test_user_4_procedure_1',
            datetime: new Date(2021, 9, 1), // (2021-10-01) 11 months ago
          },
        ],
        reminders: [],
      },
      {
        // user had eye exam 11 month ago and eye exams earlier that and have not reminders
        //will be included in the result
        id: 'uuid_test_user_5',
        procedures: [
          {
            id: 'uuid_test_user_5_procedure_1',
            datetime: new Date(2021, 8, 1), // (2021-09-01) 12 months ago
          },
          {
            id: 'uuid_test_user_5_procedure_2',
            datetime: new Date(2021, 9, 1), // (2021-10-01) 11 months ago
          },
        ],
        reminders: [],
      },
      {
        // user had eye exam 11 month ago and have reminders
        //won't be included in the result
        id: 'uuid_test_user_6',
        procedures: [
          {
            id: 'uuid_test_user_6_procedure_1',
            datetime: new Date(2021, 9, 1), // (2021-10-01) 11 months ago
          },
        ],
        reminders: [{ notification: { type: NotificationType.DiabeticEyeExamToSchedule } }],
      },
    ] as unknown as UserEntity[]

    it('should collect toExpire EyeExam notifications', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DiabeticEyeExamToExpire)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await toExpireEyeExamService.collectNotifications(NotificationType.DiabeticEyeExamToExpire)
      expect(result).toEqual([
        {
          userId: 'uuid_test_user_4',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_4_procedure_1',
        },
        {
          userId: 'uuid_test_user_5',
          notification: notifMock,
          userProcedureId: 'uuid_test_user_5_procedure_2',
        },
      ])
    })
  })
})
