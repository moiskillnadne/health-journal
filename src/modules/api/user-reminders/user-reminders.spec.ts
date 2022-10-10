import { In } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

import { createTestingModule } from '../../../core/tests/tests.helper'

import { NotificationType } from '../../../constants/enums/notifications.constants'
import { Procedure } from '../../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../../database/entities/user-reminders.entity'
import { NotificationPredefinedEntity } from '../../../database/entities/notification-predefined.entity'
import { ProceduresEntity } from '../../../database/entities/procedures.entity'

import { NotificationPredefinedCrud } from '../admin/notification/crud/notification-predefined.crud'
import { ProceduresCrudService } from '../procedures/procedures.crud'

import { UserRemindersCrudService } from './user-reminders.crud'
import { UserRemindersService } from './user-reminders.service'

describe('UserRemindersCrudService', () => {
  let userRemindersCrudService: UserRemindersCrudService

  const mockEntity: Partial<UserRemindersEntity> = {
    userId: 'userId',
  }
  const mockFind = jest.fn(() => Promise.resolve([mockEntity]))

  beforeEach(async () => {
    const module = await createTestingModule({
      providers: [
        UserRemindersCrudService,
        {
          provide: getRepositoryToken(UserRemindersEntity),
          useValue: {
            find: mockFind,
          },
        },
      ],
    })

    userRemindersCrudService = module.get<UserRemindersCrudService>(UserRemindersCrudService)
  })

  describe('getUserRemindersByParams', () => {
    it('should call find() with correct params', async () => {
      const mockWhere = { user: { settingNotifications: { eyeExamEnable: true } } }

      const result = await userRemindersCrudService.getUserRemindersByParams({
        where: mockWhere,
      })

      expect(mockFind).toHaveBeenCalledWith({
        where: {
          ...mockWhere,
        },
        relations: {
          notification: true,
        },
      })
      expect(result).toStrictEqual([mockEntity])
    })
  })
})

describe('UserRemindersService', () => {
  let userRemindersService: UserRemindersService
  let userRemindersCrudService: jest.Mocked<UserRemindersCrudService>
  let notificationPredefinedCrud: jest.Mocked<NotificationPredefinedCrud>
  let proceduresCrudService: jest.Mocked<ProceduresCrudService>

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2022, 1, 1))
  })

  beforeEach(async () => {
    const module = await createTestingModule({
      providers: [UserRemindersService],
    })

    userRemindersService = module.get<UserRemindersService>(UserRemindersService)
    userRemindersCrudService = module.get<UserRemindersCrudService, jest.Mocked<UserRemindersCrudService>>(
      UserRemindersCrudService,
    )
    notificationPredefinedCrud = module.get<NotificationPredefinedCrud, jest.Mocked<NotificationPredefinedCrud>>(
      NotificationPredefinedCrud,
    )
    proceduresCrudService = module.get<ProceduresCrudService, jest.Mocked<ProceduresCrudService>>(ProceduresCrudService)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('getUserRemindersByNotificationTypes', () => {
    it('should call getUserRemindersByParams() with correct params', async () => {
      const mockType = NotificationType.DiabeticEyeExamToSchedule
      const mockWhere = { user: { settingNotifications: { eyeExamEnable: true } } }
      const mockRelations = { procedure: true }

      await userRemindersService.getUserRemindersByNotificationTypes([mockType], {
        where: mockWhere,
        relations: mockRelations,
      })

      expect(userRemindersCrudService.getUserRemindersByParams).toHaveBeenCalledWith({
        relations: {
          ...mockRelations,
          notification: {
            procedure: true,
          },
        },
        where: {
          ...mockWhere,
          notification: {
            type: In([mockType]),
            isPublished: true,
          },
        },
      })
    })
  })

  describe('upsertUserRemindersByType', () => {
    it('should call getUserRemindersByParams() with correct params', async () => {
      const mockId = 'id'
      const mockUserId = 'userId'
      const mockType = NotificationType.DiabeticEyeExamToSchedule

      userRemindersCrudService.getUserRemindersByParams.mockResolvedValue([{} as UserRemindersEntity])
      notificationPredefinedCrud.getPredefinedNotificationByType.mockResolvedValue({
        id: mockId,
      } as NotificationPredefinedEntity)

      await userRemindersService.upsertUserRemindersByType([mockUserId, mockUserId], mockType)

      expect(userRemindersCrudService.getUserRemindersByParams.mock.calls).toEqual([
        [{ where: { userId: mockUserId, notification: { type: mockType } } }],
        [{ where: { userId: mockUserId, notification: { type: mockType } } }],
      ])
    })
  })

  describe('upsertUserRemindersByParams', () => {
    it('should call updateUserReminderById() if array of reminders passed', async () => {
      const mockId = 'id'
      const mockReminder = { id: mockId } as UserRemindersEntity
      const mockParams = { userId: 'userId' }

      await userRemindersService.upsertUserRemindersByParams([mockReminder, mockReminder], mockParams)

      expect(userRemindersCrudService.updateUserReminderById).toHaveBeenCalledWith([mockId, mockId], {
        period: null,
        interval: null,
        lastExecuteAt: new Date(),
      })
    })

    it('should call addUserReminderByParams() if no reminders passed', async () => {
      const mockParams = { userId: 'userId' }

      await userRemindersService.upsertUserRemindersByParams([], mockParams)

      expect(userRemindersCrudService.addUserReminderByParams).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('addUserReminderByParams', () => {
    it('should call addUserReminderByParams() with correct params', async () => {
      const mockParams = { userId: 'userId' }

      await userRemindersService.addUserReminderByParams(mockParams)

      expect(userRemindersCrudService.addUserReminderByParams).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('addUserReminderByNotificationType', () => {
    it('should call getPredefinedNotificationByType() and addUserReminderByParams() with correct params', async () => {
      const mockId = 'id'
      const mockType = NotificationType.DiabeticEyeExamToSchedule
      const mockParams = { interval: 1 }

      notificationPredefinedCrud.getPredefinedNotificationByType.mockResolvedValue({
        id: mockId,
      } as NotificationPredefinedEntity)

      await userRemindersService.addUserReminderByNotificationType(mockType, mockParams)

      expect(notificationPredefinedCrud.getPredefinedNotificationByType).toHaveBeenCalledWith(mockType)
      expect(userRemindersCrudService.addUserReminderByParams).toHaveBeenCalledWith({
        notificationId: mockId,
        ...mockParams,
      })
    })
  })

  describe('addUserReminderByProcedureId', () => {
    it('should call getProcedureById() and addUserReminderByParams() with correct params', async () => {
      const mockId = 'id'
      const mockTag = Procedure.DiabeticEyeExam
      const mockType = NotificationType.DiabeticEyeExamToExpire
      const mockParams = { interval: 1 }

      proceduresCrudService.getProcedureById.mockResolvedValue({
        tag: mockTag,
      } as ProceduresEntity)
      notificationPredefinedCrud.getPredefinedNotificationByType.mockResolvedValue({
        id: mockId,
      } as NotificationPredefinedEntity)

      await userRemindersService.addUserReminderByProcedureId(mockId, mockParams)

      expect(proceduresCrudService.getProcedureById).toHaveBeenCalledWith(mockId)
      expect(notificationPredefinedCrud.getPredefinedNotificationByType).toHaveBeenCalledWith(mockType)
      expect(userRemindersCrudService.addUserReminderByParams).toHaveBeenCalledWith({
        notificationId: mockId,
        ...mockParams,
      })
    })
  })

  describe('updateUserReminderById', () => {
    it('should call updateUserReminderById() with correct params', async () => {
      const mockId = 'id'
      const mockParams = { interval: 1 }

      await userRemindersService.updateUserReminderById(mockId, mockParams)

      expect(userRemindersCrudService.updateUserReminderById).toHaveBeenCalledWith(mockId, mockParams)
    })
  })

  describe('deleteUserReminderByNotificationType', () => {
    it('should call getPredefinedNotificationByType() and deleteUserRemindersByParams() with correct params', async () => {
      const mockId = 'id'
      const mockType = NotificationType.DiabeticEyeExamToExpire
      const mockParams = { userId: 'userId' }

      notificationPredefinedCrud.getPredefinedNotificationByType.mockResolvedValue({
        id: mockId,
      } as NotificationPredefinedEntity)

      await userRemindersService.deleteUserReminderByNotificationType(mockType, mockParams)

      expect(notificationPredefinedCrud.getPredefinedNotificationByType).toHaveBeenCalledWith(mockType)
      expect(userRemindersCrudService.deleteUserRemindersByParams).toHaveBeenCalledWith({
        notificationId: mockId,
        ...mockParams,
      })
    })
  })

  describe('deleteUserReminderById', () => {
    it('should call deleteUserReminderById() with correct params', async () => {
      const mockId = 'id'

      await userRemindersService.deleteUserReminderById(mockId)

      expect(userRemindersCrudService.deleteUserReminderById).toHaveBeenCalledWith(mockId)
    })
  })

  describe('upsertReminder', () => {
    it('should call upsert() with correct params', async () => {
      const mockUserId = 'userId'
      const mockNotificationId = 'notificationId'
      const mockParams = { interval: 1 }

      await userRemindersService.upsertReminder(mockUserId, mockNotificationId, mockParams)

      expect(userRemindersCrudService.upsert).toHaveBeenCalledWith(
        { ...mockParams, userId: mockUserId, notificationId: mockNotificationId },
        ['userId', 'notificationId'],
      )
    })
  })
})
