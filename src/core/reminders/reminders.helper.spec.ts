import { addDays, subDays } from 'date-fns'

import { Procedure } from '../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../database/entities/user-reminders.entity'

import { getNotificationPayloadByReminders, hasEmptyUserProceduresHistory } from './reminders.helper'

describe('RemindersHelper', () => {
  const mockReminder = {
    id: 'id',
    userId: 'id',
    notification: {
      id: 'id',
    },
    procedure: {
      id: 'id',
      name: 'name',
    },
    user: {
      procedures: [
        {
          name: 'name',
          datetime: addDays(new Date(), 1),
          procedure: {
            tag: Procedure.BloodStoolTesting,
          },
        },
      ],
    },
  } as UserRemindersEntity

  const mockReminderOtherUser = {
    ...mockReminder,
    userId: mockReminder.userId + 1,
    user: {
      procedures: [
        {
          datetime: subDays(new Date(), 1),
          procedure: {
            tag: Procedure.Colonography,
          },
        },
      ],
    },
  } as UserRemindersEntity

  const mockReminderSameUser = {
    ...mockReminder,
    user: {
      procedures: [
        {
          datetime: addDays(new Date(), 1),
          procedure: {
            tag: Procedure.Colonoscopy,
          },
        },
      ],
    },
  } as UserRemindersEntity

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2022, 1, 1))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('getUserRemindersByParams', () => {
    it('should return prepared array', async () => {
      const mockReminderPartial = {
        ...mockReminder,
        procedure: null,
      }

      const result = getNotificationPayloadByReminders([mockReminder, mockReminderPartial])

      expect(result).toStrictEqual([
        {
          notification: mockReminder.notification,
          userId: mockReminder.userId,
          userProcedureId: mockReminder.procedure.id,
        },
        {
          notification: mockReminder.notification,
          userId: mockReminder.userId,
        },
      ])
    })
  })

  describe('hasEmptyUserProceduresHistory', () => {
    it('should return false in case same user in list', async () => {
      const result = hasEmptyUserProceduresHistory(
        mockReminder,
        [mockReminderSameUser],
        [Procedure.BloodStoolTesting, Procedure.Colonoscopy, Procedure.Colonography],
        new Date(),
      )

      expect(result).toStrictEqual(false)
    })

    it('should return false in case user procedure name match and procedure datetime > datetime passed', async () => {
      const result = hasEmptyUserProceduresHistory(
        mockReminder,
        [mockReminderOtherUser],
        [Procedure.BloodStoolTesting],
        new Date(),
      )

      expect(result).toStrictEqual(false)
    })

    it('should return true in case procedure tag does not match', async () => {
      const result = hasEmptyUserProceduresHistory(mockReminder, [], [Procedure.Colonoscopy], new Date())

      expect(result).toStrictEqual(true)
    })

    it('should return true in case procedure datetime < datetime passed', async () => {
      const result = hasEmptyUserProceduresHistory(
        mockReminderOtherUser,
        [mockReminder],
        [Procedure.Colonography],
        new Date(),
      )

      expect(result).toStrictEqual(true)
    })
  })
})
