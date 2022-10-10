import { Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { BlankMammogramService } from './blank-mammogram.service'
import { createTestingModule } from '../../../../tests/tests.helper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

const mockNowDate = new Date(2022, 8, 1, 12, 7, 16) // 2022-09-01 12:07:16 GMT

describe('BlankMammogramService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userEntityRepositoryMock: jest.Mocked<Repository<UserEntity>>
  let blankMammogramService: BlankMammogramService

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(mockNowDate)
    const module = await createTestingModule({
      providers: [
        BlankMammogramService,
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
    blankMammogramService = module.get<BlankMammogramService>(BlankMammogramService)
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
        // user has no mammogram procedures
        //will be included in the result
        id: 'uuid_test_user_1',
        procedures: [
          {
            id: 'uuid_test_user_1_procedure_1',
            datetime: new Date(2022, 8, 8), // (2022-09-04) in one week
            procedure: { tag: Procedure.DiabeticEyeExam },
          },
        ],
        reminders: [
          {
            notification: { type: NotificationType.DiabeticEyeExamToSchedule },
          },
          {
            notification: { type: NotificationType.DoctorAppointmentToSchedule },
          },
        ],
      },
      {
        // user has scheduled mammogram and has no mammogram reminders
        id: 'uuid_test_user_2',
        procedures: [
          {
            id: 'uuid_test_user_2_procedure_1',
            datetime: new Date(2022, 8, 4), // (2022-09-04) in 3 days
            procedure: { tag: Procedure.Mammogram },
          },
          {
            id: 'uuid_test_user_2_procedure_2',
            datetime: new Date(2022, 8, 8), // (2022-09-04) in one week
            procedure: { tag: Procedure.DiabeticEyeExam },
          },
        ],
        reminders: [
          {
            notification: { type: NotificationType.DiabeticEyeExamToSchedule },
          },
          {
            notification: { type: NotificationType.DoctorAppointmentToSchedule },
          },
        ],
      },
      {
        // user has not scheduled mammogram procedures and has reminders
        id: 'uuid_test_user_3',
        procedures: [
          {
            id: 'uuid_test_user_3_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
            procedure: { tag: Procedure.Mammogram },
          },
          {
            id: 'uuid_test_user_3_procedure_2',
            datetime: new Date(2022, 8, 8), // (2022-09-04) in one week
            procedure: { tag: Procedure.DiabeticEyeExam },
          },
        ],
        reminders: [
          {
            notification: { type: NotificationType.MammogramToSchedule },
          },
          {
            notification: { type: NotificationType.DiabeticEyeExamToSchedule },
          },
          {
            notification: { type: NotificationType.DoctorAppointmentToSchedule },
          },
        ],
      },
      {
        // user has not scheduled mammograms and has no reminders
        //will be included in the result
        id: 'uuid_test_user_4',
        procedures: [
          {
            id: 'uuid_test_user_4_procedure_1',
            datetime: new Date(2021, 8, 1), // (2022-08-04) 1 year ago
            procedure: { tag: Procedure.Mammogram },
          },
          {
            id: 'uuid_test_user_4_procedure_2',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
            procedure: { tag: Procedure.Mammogram },
          },
          {
            id: 'uuid_test_user_4_procedure_3',
            datetime: new Date(2022, 8, 8), // (2022-09-04) in one week
            procedure: { tag: Procedure.DiabeticEyeExam },
          },
        ],
        reminders: [
          {
            notification: { type: NotificationType.DiabeticEyeExamToSchedule },
          },
          {
            notification: { type: NotificationType.DoctorAppointmentToSchedule },
          },
        ],
      },
    ] as unknown as UserEntity[]

    it('should collect notifications for blank mammograms', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.MammogramToSchedule)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await blankMammogramService.collectNotifications(NotificationType.MammogramToSchedule)
      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
        },
        {
          userId: 'uuid_test_user_4',
          notification: notifMock,
        },
      ])
    })
  })
})
