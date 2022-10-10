import { Repository } from 'typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { createTestingModule } from '../../../../tests/tests.helper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BlankPapSmearService } from './blank-pap-smear.service'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

const mockNowDate = new Date(2022, 8, 1, 12, 7, 16) // 2022-09-01 12:07:16 GMT

describe('BlankPapSmearService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userEntityRepositoryMock: jest.Mocked<Repository<UserEntity>>
  let blankPapSmearService: BlankPapSmearService

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(mockNowDate)
    const module = await createTestingModule({
      providers: [
        BlankPapSmearService,
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
    blankPapSmearService = module.get<BlankPapSmearService>(BlankPapSmearService)
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
        // user has no PapSmear procedures
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
        // user has scheduled PapSmear and has no PapSmear reminders
        id: 'uuid_test_user_2',
        procedures: [
          {
            id: 'uuid_test_user_2_procedure_1',
            datetime: new Date(2022, 8, 4), // (2022-09-04) in 3 days
            procedure: { tag: Procedure.PapSmear },
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
        // user has not scheduled PapSmear procedures and has reminders
        id: 'uuid_test_user_3',
        procedures: [
          {
            id: 'uuid_test_user_3_procedure_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
            procedure: { tag: Procedure.PapSmear },
          },
          {
            id: 'uuid_test_user_3_procedure_2',
            datetime: new Date(2022, 8, 8), // (2022-09-04) in one week
            procedure: { tag: Procedure.DiabeticEyeExam },
          },
        ],
        reminders: [
          {
            notification: { type: NotificationType.PapSmearToSchedule },
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
        // user has not scheduled PapSmear and has no reminders
        //will be included in the result
        id: 'uuid_test_user_4',
        procedures: [
          {
            id: 'uuid_test_user_4_procedure_1',
            datetime: new Date(2021, 8, 1), // (2022-08-04) 1 year ago
            procedure: { tag: Procedure.PapSmear },
          },
          {
            id: 'uuid_test_user_4_procedure_2',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
            procedure: { tag: Procedure.PapSmear },
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

    it('should collect notifications for blank PapSmear', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.MammogramToSchedule)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await blankPapSmearService.collectNotifications(NotificationType.MammogramToSchedule)
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
