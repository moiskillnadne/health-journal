import { addDays, subDays, subMonths, subWeeks, subYears } from 'date-fns'

import { createTestingModule } from '../../../tests/tests.helper'

import { ReminderPeriod } from '../../../../constants/enums/reminders.constants'
import { NotificationType } from '../../../../constants/enums/notifications.constants'
import { Procedure } from '../../../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../../../database/entities/user-reminders.entity'

import { UserRemindersService } from '../../../../modules/api/user-reminders/user-reminders.service'
import { NotificationService } from '../../../notifications/predefined/notification.service'

import { OtherProcedureReminderService } from './other-procedure.service'

jest.mock('../../reminders.logger')

describe('OtherProcedureReminderService', () => {
  let otherProcedureReminderService: OtherProcedureReminderService
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
      providers: [OtherProcedureReminderService],
    })

    otherProcedureReminderService = module.get<OtherProcedureReminderService>(OtherProcedureReminderService)
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
              procedure: { tag: Procedure.Other },
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
              procedure: { tag: Procedure.Other },
            },
          ],
        },
        procedure: {
          id: mockId,
          name: mockName,
          datetime: subMonths(new Date(), 2),
          procedure: { tag: Procedure.Other },
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
              procedure: { tag: Procedure.Other },
            },
          ],
        },
        procedure: {
          name: mockName,
          datetime: subYears(new Date(), 2),
          procedure: { tag: Procedure.Other },
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

  describe('sendOtherProcedureToScheduleReminder', () => {
    it('should call getUserRemindersByNotificationTypes() with correct params', async () => {
      await otherProcedureReminderService.sendOtherProcedureToScheduleReminder()

      expect(userRemindersService.getUserRemindersByNotificationTypes).toHaveBeenCalledWith(
        [NotificationType.OtherProcedureToSchedule],
        {
          relations: { user: { procedures: { procedure: true } } },
        },
      )
    })

    it('should call updateUserReminderById() and send() with correct params', async () => {
      await otherProcedureReminderService.sendOtherProcedureToScheduleReminder()

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

  describe('sendOtherProcedureToExpireReminder', () => {
    it('should call getUserRemindersByNotificationTypes() with correct params', async () => {
      await otherProcedureReminderService.sendOtherProcedureToExpireReminder()

      expect(userRemindersService.getUserRemindersByNotificationTypes).toHaveBeenCalledWith(
        [NotificationType.OtherProcedureToExpire],
        {
          relations: { procedure: true, user: { procedures: { procedure: true } } },
        },
      )
    })

    it('should call updateUserReminderById(), upsertUserRemindersByType() and send() with correct params', async () => {
      await otherProcedureReminderService.sendOtherProcedureToExpireReminder()

      expect(userRemindersService.updateUserReminderById).toHaveBeenCalledWith([mockId, mockId, mockId], {
        lastExecuteAt: new Date(),
      })
      expect(userRemindersService.upsertUserRemindersByType).toHaveBeenCalledWith(
        [mockUserId, mockUserId + 1, mockUserId + 2],
        NotificationType.OtherProcedureToSchedule,
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
          },
          userId: mockUserId + 2,
          userProcedureId: mockId,
        },
      ])
    })
  })
})
