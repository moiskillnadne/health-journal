import { addDays, subDays, subYears } from 'date-fns'

import { createTestingModule } from '../../../tests/tests.helper'

import { ReminderPeriod } from '../../../../constants/enums/reminders.constants'
import { NotificationType } from '../../../../constants/enums/notifications.constants'

import { UserRemindersEntity } from '../../../../database/entities/user-reminders.entity'

import { UserRemindersService } from '../../../../modules/api/user-reminders/user-reminders.service'
import { NotificationService } from '../../../notifications/predefined/notification.service'

import { DoctorAppointmentReminderService } from './doctor-appointment.service'
import { NotificationPredefinedEntity } from '../../../../database/entities/notification-predefined.entity'

jest.mock('../../reminders.logger')

describe('DoctorAppointmentReminderService', () => {
  let doctorAppointmentReminderService: DoctorAppointmentReminderService
  let userRemindersService: jest.Mocked<UserRemindersService>
  let notificationService: jest.Mocked<NotificationService>

  let mockId: string
  let mockUserId: string
  let mockNotification: Partial<NotificationPredefinedEntity>

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2022, 1, 1))
  })

  beforeEach(async () => {
    const module = await createTestingModule({
      providers: [DoctorAppointmentReminderService],
    })

    doctorAppointmentReminderService = module.get<DoctorAppointmentReminderService>(DoctorAppointmentReminderService)
    userRemindersService = module.get<UserRemindersService, jest.Mocked<UserRemindersService>>(UserRemindersService)
    notificationService = module.get<NotificationService, jest.Mocked<NotificationService>>(NotificationService)

    mockId = 'id'
    mockUserId = 'id'
    mockNotification = {
      id: 'id',
    }

    userRemindersService.getUserRemindersByNotificationTypes.mockResolvedValue([
      {
        id: mockId,
        userId: mockUserId,
        period: ReminderPeriod.Day,
        interval: 1,
        lastExecuteAt: subDays(new Date(), 1),
        notification: mockNotification,
        user: {
          appointments: [],
        },
        procedure: {
          id: mockId,
        },
      } as UserRemindersEntity,
      {
        id: mockId,
        userId: mockUserId,
        lastExecuteAt: subYears(new Date(), 1),
        notification: {
          remindPeriod: ReminderPeriod.Year,
          remindInterval: 1,
        },
        user: {
          appointments: [{ datetime: addDays(new Date(), 1) }],
        },
      } as UserRemindersEntity,
      {
        id: mockId,
        userId: mockUserId,
        period: ReminderPeriod.Day,
        interval: 7,
        lastExecuteAt: subDays(new Date(), 1),
      } as UserRemindersEntity,
    ])
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('sendDoctorAppointmentToScheduleReminder', () => {
    it('should call getUserRemindersByNotificationTypes() with correct params', async () => {
      const mockType = NotificationType.DoctorAppointmentToSchedule
      const mockRelations = { user: { appointments: true } }
      const mockWhere = { user: { settingNotifications: { scheduleAnAppointmentEnable: true } } }

      await doctorAppointmentReminderService.sendDoctorAppointmentToScheduleReminder()

      expect(userRemindersService.getUserRemindersByNotificationTypes).toHaveBeenCalledWith([mockType], {
        where: mockWhere,
        relations: mockRelations,
      })
    })

    it('should call updateUserReminderById() and send() with correct params', async () => {
      await doctorAppointmentReminderService.sendDoctorAppointmentToScheduleReminder()

      expect(userRemindersService.updateUserReminderById).toHaveBeenCalledWith([mockId], { lastExecuteAt: new Date() })
      expect(notificationService.send).toHaveBeenCalledWith([
        {
          notification: mockNotification,
          userId: mockUserId,
          userProcedureId: mockId,
        },
      ])
    })
  })
})
