import { createTestingModule } from '../../../../tests/tests.helper'
import { ScheduledAppointmentsService } from './scheduled-appointments.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { Repository } from 'typeorm'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'

const mockNowDate = new Date(2022, 8, 1, 12, 7, 16) // 2022-09-01 12:07:16 GMT

describe('ScheduledAppointmentsService', () => {
  let notificationPredefinedEntityRepositoryMock: jest.Mocked<Repository<NotificationPredefinedEntity>>
  let userEntityRepositoryMock: jest.Mocked<Repository<UserEntity>>
  let scheduledAppointmentsService: ScheduledAppointmentsService

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(mockNowDate)
    const module = await createTestingModule({
      providers: [
        ScheduledAppointmentsService,
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
    scheduledAppointmentsService = module.get<ScheduledAppointmentsService>(ScheduledAppointmentsService)
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
        appointments: [
          {
            id: 'uuid_test_user_1_appointment_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_1_appointment_2',
            datetime: new Date(2022, 7, 28), // (2022-08-28) 4 day ago
          },
          {
            id: 'uuid_test_user_1_appointment_3',
            datetime: new Date(2022, 7, 29), // (2022-08-29) 3 day ago
          },
          {
            id: 'uuid_test_user_1_appointment_4',
            datetime: new Date(2022, 7, 31), // (2022-08-31) 1 day ago
          },
          {
            id: 'uuid_test_user_1_appointment_5',
            datetime: new Date(2022, 8, 2), // (2022-09-02) in 1 day
          },
          {
            id: 'uuid_test_user_1_appointment_6',
            datetime: new Date(2022, 8, 8), // (2022-09-08) in 1 week
          },
          {
            id: 'uuid_test_user_1_appointment_7',
            datetime: new Date(2022, 8, 15), // (2022-09-15) in 2 week
          },
          {
            id: 'uuid_test_user_1_appointment_8',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_2_without_appointments',
        appointments: [],
      },
      {
        id: 'uuid_test_user_3',
        appointments: [
          {
            id: 'uuid_test_user_3_appointment_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_3_appointment_2',
            datetime: new Date(2022, 7, 29), // (2022-08-29) 3 day ago
          },
          {
            id: 'uuid_test_user_3_appointment_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_4',
        appointments: [
          {
            id: 'uuid_test_user_4_appointment_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_4_appointment_2',
            datetime: new Date(2022, 7, 31), // (2022-08-31) 1 day ago
          },
          {
            id: 'uuid_test_user_4_appointment_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_5',
        appointments: [
          {
            id: 'uuid_test_user_5_appointment_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_5_appointment_2',
            datetime: new Date(2022, 8, 2), // (2022-09-02) in 1 day
          },
          {
            id: 'uuid_test_user_5_appointment_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_6',
        appointments: [
          {
            id: 'uuid_test_user_6_appointment_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_6_appointment_2',
            datetime: new Date(2022, 8, 8), // (2022-09-08) in 1 week
          },
          {
            id: 'uuid_test_user_6_appointment_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
      {
        id: 'uuid_test_user_7',
        appointments: [
          {
            id: 'uuid_test_user_7_appointment_1',
            datetime: new Date(2022, 7, 4), // (2022-08-04) 4 weeks ago
          },
          {
            id: 'uuid_test_user_7_appointment_2',
            datetime: new Date(2022, 8, 15), // (2022-09-15) in 2 week
          },
          {
            id: 'uuid_test_user_7_appointment_3',
            datetime: new Date(2022, 8, 22), // (2022-09-22) in 3 week
          },
        ],
      },
    ] as unknown as UserEntity[]

    it('should collect notifications for appointments that where 3 days ago', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DoctorAppointmentThreeDaysAgo)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledAppointmentsService.collectNotifications(
        NotificationType.DoctorAppointmentThreeDaysAgo,
      )

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_1_appointment_3',
        },
        {
          userId: 'uuid_test_user_3',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_3_appointment_2',
        },
      ])
    })

    it('should collect notifications for appointments that where 1 day ago', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DoctorAppointmentOneDayAgo)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledAppointmentsService.collectNotifications(
        NotificationType.DoctorAppointmentOneDayAgo,
      )

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_1_appointment_4',
        },
        {
          userId: 'uuid_test_user_4',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_4_appointment_2',
        },
      ])
    })

    it('should collect notifications for appointments that will be in 1 day', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DoctorAppointmentInOneDay)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledAppointmentsService.collectNotifications(NotificationType.DoctorAppointmentInOneDay)

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_1_appointment_5',
        },
        {
          userId: 'uuid_test_user_5',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_5_appointment_2',
        },
      ])
    })

    it('should collect notifications for appointments that will be in 1 week', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DoctorAppointmentInOneWeek)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledAppointmentsService.collectNotifications(
        NotificationType.DoctorAppointmentInOneWeek,
      )

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_1_appointment_6',
        },
        {
          userId: 'uuid_test_user_6',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_6_appointment_2',
        },
      ])
    })

    it('should collect notifications for appointments that will be in 2 weeks', async () => {
      const notifMock = getMockPredefinedNotif(NotificationType.DoctorAppointmentInTwoWeeks)
      notificationPredefinedEntityRepositoryMock.findOne.mockImplementation(async () => notifMock)
      userEntityRepositoryMock.find.mockImplementation(async () => usersMock)
      const result = await scheduledAppointmentsService.collectNotifications(
        NotificationType.DoctorAppointmentInTwoWeeks,
      )

      expect(result).toEqual([
        {
          userId: 'uuid_test_user_1',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_1_appointment_7',
        },
        {
          userId: 'uuid_test_user_7',
          notification: notifMock,
          userAppointmentId: 'uuid_test_user_7_appointment_2',
        },
      ])
    })
  })
})
