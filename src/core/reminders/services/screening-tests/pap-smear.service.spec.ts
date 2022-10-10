import { addDays, subDays, subMonths, subWeeks, subYears } from 'date-fns'

import { createTestingModule } from '../../../tests/tests.helper'

import { ReminderPeriod } from '../../../../constants/enums/reminders.constants'
import { NotificationType } from '../../../../constants/enums/notifications.constants'
import { Procedure } from '../../../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../../../database/entities/user-reminders.entity'

import { UserRemindersService } from '../../../../modules/api/user-reminders/user-reminders.service'
import { NotificationService } from '../../../notifications/predefined/notification.service'

import { PapSmearReminderService } from './pap-smear.service'

jest.mock('../../reminders.logger')

describe('PapSmearReminderService', () => {
  let papSmearReminderService: PapSmearReminderService
  let userRemindersService: jest.Mocked<UserRemindersService>
  let notificationService: jest.Mocked<NotificationService>

  let mockId: string
  let mockUserId: string
  let mockName: string

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2022, 1, 1))
  })

  beforeEach(async () => {
    const module = await createTestingModule({
      providers: [PapSmearReminderService],
    })

    papSmearReminderService = module.get<PapSmearReminderService>(PapSmearReminderService)
    userRemindersService = module.get<UserRemindersService, jest.Mocked<UserRemindersService>>(UserRemindersService)
    notificationService = module.get<NotificationService, jest.Mocked<NotificationService>>(NotificationService)

    mockId = 'id'
    mockUserId = 'id'
    mockName = 'name'

    userRemindersService.getUserRemindersByNotificationTypes.mockResolvedValue([
      // Valid
      {
        id: mockId,
        userId: mockUserId,
        period: ReminderPeriod.Day,
        interval: 1,
        lastExecuteAt: subDays(new Date(), 1),
        notification: {
          id: mockId,
        },
        user: {
          procedures: [],
        },
        procedure: {
          id: mockId,
        },
      } as UserRemindersEntity,
      // Valid
      {
        id: mockId,
        userId: mockUserId + 1,
        lastExecuteAt: subWeeks(new Date(), 4),
        notification: {
          id: mockId,
          remindPeriod: ReminderPeriod.Week,
          remindInterval: 4,
        },
        user: {
          procedures: [
            {
              datetime: subWeeks(new Date(), 8),
              procedure: { tag: Procedure.PapSmear },
            },
          ],
        },
        procedure: null,
      } as UserRemindersEntity,
      // Valid
      {
        id: mockId,
        userId: mockUserId + 2,
        period: ReminderPeriod.Month,
        interval: 2,
        notification: {
          id: mockId,
        },
        user: {
          procedures: [
            {
              name: mockName,
              datetime: subMonths(new Date(), 4),
              procedure: { tag: Procedure.PapSmear },
            },
          ],
        },
        procedure: {
          id: mockId,
          name: mockName,
          datetime: subMonths(new Date(), 2),
          procedure: { tag: Procedure.PapSmear },
        },
      } as UserRemindersEntity,
      // Invalid
      {
        id: mockId,
        userId: mockUserId + 3,
        lastExecuteAt: subYears(new Date(), 1),
        notification: {
          id: mockId,
          remindPeriod: ReminderPeriod.Year,
          remindInterval: 1,
        },
        user: {
          procedures: [
            {
              name: mockName,
              datetime: addDays(new Date(), 1),
              procedure: { tag: Procedure.PapSmear },
            },
          ],
        },
        procedure: {
          name: mockName,
          datetime: subYears(new Date(), 2),
          procedure: { tag: Procedure.PapSmear },
        },
      } as UserRemindersEntity,
      // Invalid
      {
        id: mockId,
        userId: mockUserId + 4,
        period: ReminderPeriod.Day,
        interval: 7,
        lastExecuteAt: subDays(new Date(), 1),
      } as UserRemindersEntity,
    ])
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('sendPapSmearToScheduleReminder', () => {
    it('should call getUserRemindersByNotificationTypes() with correct params', async () => {
      await papSmearReminderService.sendPapSmearToScheduleReminder()

      expect(userRemindersService.getUserRemindersByNotificationTypes).toHaveBeenCalledWith(
        [NotificationType.PapSmearToSchedule],
        {
          relations: { user: { procedures: { procedure: true } } },
          where: { user: { settingNotifications: { screeningTestsEnable: true, papSmearEnable: true } } },
        },
      )
    })

    it('should call updateUserReminderById() and send() with correct params', async () => {
      await papSmearReminderService.sendPapSmearToScheduleReminder()

      expect(userRemindersService.updateUserReminderById).toHaveBeenCalledWith([mockId, mockId], {
        lastExecuteAt: new Date(),
      })
      expect(notificationService.send).toHaveBeenCalledWith([
        {
          notification: {
            id: mockId,
          },
          userId: mockUserId,
          userProcedureId: mockId,
        },
        {
          notification: {
            id: mockId,
            remindPeriod: ReminderPeriod.Week,
            remindInterval: 4,
          },
          userId: mockUserId + 1,
        },
      ])
    })
  })

  describe('sendPapSmearToExpireReminder', () => {
    it('should call getUserRemindersByNotificationTypes() with correct params', async () => {
      await papSmearReminderService.sendPapSmearToExpireReminder()

      expect(userRemindersService.getUserRemindersByNotificationTypes).toHaveBeenCalledWith(
        [NotificationType.PapSmearToExpire],
        {
          relations: { procedure: true, user: { procedures: { procedure: true } } },
          where: { user: { settingNotifications: { screeningTestsEnable: true, papSmearEnable: true } } },
        },
      )
    })

    it('should call updateUserReminderById(), upsertUserRemindersByType() and send() with correct params', async () => {
      await papSmearReminderService.sendPapSmearToExpireReminder()

      expect(userRemindersService.updateUserReminderById).toHaveBeenCalledWith([mockId, mockId, mockId], {
        lastExecuteAt: new Date(),
      })
      expect(userRemindersService.upsertUserRemindersByType).toHaveBeenCalledWith(
        [mockUserId, mockUserId + 1, mockUserId + 3],
        NotificationType.PapSmearToSchedule,
      )
      expect(notificationService.send).toHaveBeenCalledWith([
        {
          notification: {
            id: mockId,
          },
          userId: mockUserId,
          userProcedureId: mockId,
        },
        {
          notification: {
            id: mockId,
            remindPeriod: ReminderPeriod.Week,
            remindInterval: 4,
          },
          userId: mockUserId + 1,
        },
        {
          notification: {
            id: mockId,
            remindPeriod: ReminderPeriod.Year,
            remindInterval: 1,
          },
          userId: mockUserId + 3,
        },
      ])
    })
  })
})
