import { createTestingModule } from '../../tests/tests.helper'
import { NotificationService } from './notification.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserEntity } from '../../../database/entities/user.entity'
import { NotificationPredefinedEntity } from '../../../database/entities/notification-predefined.entity'
import { UserNotificationsPredefinedEntity } from '../../../database/entities/user-notifications-predefined.entity'
import { UserProceduresEntity } from '../../../database/entities/user-procedures.entity'
import { UserAppointmentsEntity } from '../../../database/entities/user-appointments.entity'
import { FirebaseService } from '../../../integrations/firebase/firebase.service'
import { PredefinedNotificationsSendingStrategy as SendingStrategy } from '../notifications.constants'
import { PreparedPredefinedNotification, RawPredefinedNotification } from './dto/notifications-predefined.dto'
import { Repository } from 'typeorm'

describe('NotificationService', () => {
  let notificationService: jest.Mocked<NotificationService>
  let userEntityRepository: jest.Mocked<Repository<UserEntity>>
  let userNotificationsPredefinedEntityRepository: jest.Mocked<Repository<UserNotificationsPredefinedEntity>>
  let userProceduresEntityRepository: jest.Mocked<Repository<UserProceduresEntity>>
  let userAppointmentsEntityRepository: jest.Mocked<Repository<UserAppointmentsEntity>>
  let firebaseService: jest.Mocked<FirebaseService>

  beforeEach(async () => {
    const module = await createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserNotificationsPredefinedEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(NotificationPredefinedEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserProceduresEntity),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserAppointmentsEntity),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: FirebaseService,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
      ],
    })
    notificationService = module.get<NotificationService, jest.Mocked<NotificationService>>(NotificationService)
    userEntityRepository = module.get(getRepositoryToken(UserEntity))
    userNotificationsPredefinedEntityRepository = module.get(getRepositoryToken(UserNotificationsPredefinedEntity))
    userProceduresEntityRepository = module.get(getRepositoryToken(UserProceduresEntity))
    userAppointmentsEntityRepository = module.get(getRepositoryToken(UserAppointmentsEntity))
    firebaseService = module.get<FirebaseService, jest.Mocked<FirebaseService>>(FirebaseService)
  })
  describe('sendInApp', () => {
    it('should save only in-app messages to db', async () => {
      const preparedPredefinedNotificationsStub = [
        {
          notification: {
            name: 'Test Notification 1',
            contentEn: 'test en text 1',
            contentSp: 'test sp text 1',
          },
          user: {
            id: 'uuid_test_user_1',
          },
          userAppointment: {
            id: 'uiid_user_appointment_test_user_1',
          },
          userProcedure: {
            id: 'uiid_user_procedure_test_user_1',
          },
          sendStrategy: [SendingStrategy.inApp],
        },
        {
          notification: {
            name: 'Test Notification 1',
            contentEn: 'test en text 1',
            contentSp: 'test sp text 1',
          },
          user: {
            id: 'uuid_test_user_2',
          },
          userAppointment: {
            id: 'uiid_user_appointment_test_user_2',
          },
          userProcedure: {
            id: 'uiid_user_procedure_test_user_2',
          },
          sendStrategy: [SendingStrategy.inApp, SendingStrategy.push],
        },
        {
          notification: {
            name: 'Test Notification 1',
            contentEn: 'test en text 1',
            contentSp: 'test sp text 1',
          },
          user: {
            id: 'uuid_test_user_3',
          },
          userAppointment: {
            id: 'uiid_user_appointment_test_user_3',
          },
          userProcedure: {
            id: 'uiid_user_procedure_test_user_3',
          },
          sendStrategy: [SendingStrategy.push],
        },
      ] as PreparedPredefinedNotification[]

      await notificationService.sendInApp(preparedPredefinedNotificationsStub)

      expect(userNotificationsPredefinedEntityRepository.save).toHaveBeenCalledWith([
        {
          title: 'Test Notification 1',
          bodyEn: 'test en text 1',
          bodySp: 'test sp text 1',
          user: {
            id: 'uuid_test_user_1',
          },
          notification: {
            name: 'Test Notification 1',
            contentEn: 'test en text 1',
            contentSp: 'test sp text 1',
          },
          appointment: {
            id: 'uiid_user_appointment_test_user_1',
          },
          procedure: {
            id: 'uiid_user_procedure_test_user_1',
          },
        },
        {
          title: 'Test Notification 1',
          bodyEn: 'test en text 1',
          bodySp: 'test sp text 1',
          user: {
            id: 'uuid_test_user_2',
          },
          notification: {
            name: 'Test Notification 1',
            contentEn: 'test en text 1',
            contentSp: 'test sp text 1',
          },
          appointment: {
            id: 'uiid_user_appointment_test_user_2',
          },
          procedure: {
            id: 'uiid_user_procedure_test_user_2',
          },
        },
      ])
    })
  })

  describe('sendInApp', () => {
    it('should send only push messages to the firebase', async () => {
      const preparedPredefinedNotificationsStub = [
        {
          notification: {
            id: 'uuid_notification_1',
            name: 'Test Notification 1',
            contentEn: 'test en text 1',
            contentSp: 'test sp text 1',
            procedure: {
              id: 'uuid_notification_procedure_id',
            },
          },
          user: {
            id: 'uuid_test_user_1',
          },
          userAppointment: {
            id: 'uiid_user_appointment_test_user_1',
          },
          userProcedure: {
            id: 'uiid_user_procedure_test_user_1',
          },
          sendStrategy: [SendingStrategy.inApp],
        },
        {
          notification: {
            id: 'uuid_notification_2',
            name: 'Test Notification 2',
            contentEn: 'test en text 2',
            contentSp: 'test sp text 2',
            type: 'notification_type_2',
            article: {
              id: 'uuid_test_article_2',
              isPublished: true,
            },
            procedure: {
              id: 'uuid_notification_procedure_id_2',
            },
          } as any as NotificationPredefinedEntity,
          user: {
            id: 'uuid_test_user_2',
          },
          userAppointment: {
            id: 'uiid_user_appointment_test_user_2',
          },
          userProcedure: {
            id: 'uiid_user_procedure_test_user_2',
          },
          sendStrategy: [SendingStrategy.inApp, SendingStrategy.push],
        },
        {
          notification: {
            id: 'uuid_notification_3',
            name: 'Test Notification 3',
            contentEn: 'test en text 3',
            contentSp: 'test sp text 3',
            type: 'notification_type_3',
          } as any as NotificationPredefinedEntity,
          user: {
            id: 'uuid_test_user_3',
          },
          sendStrategy: [SendingStrategy.push],
        },
      ] as PreparedPredefinedNotification[]

      await notificationService.sendPush(preparedPredefinedNotificationsStub)

      expect(firebaseService.sendNotification.mock.calls).toEqual([
        [
          ['uuid_test_user_2'],
          {
            title: 'Test Notification 2',
            body: 'test en text 2',
            imageId: null,
            data: {
              type: 'notification_type_2',
              payload: {
                id: 'uuid_notification_2',
                userId: 'uuid_test_user_2',
                articleId: 'uuid_test_article_2',
                procedureId: 'uuid_notification_procedure_id_2',
                userAppointmentId: 'uiid_user_appointment_test_user_2',
                userProcedureId: 'uiid_user_procedure_test_user_2',
                isContentValid: 'true',
              },
            },
          },
        ],
        [
          ['uuid_test_user_3'],
          {
            title: 'Test Notification 3',
            body: 'test en text 3',
            imageId: null,
            data: {
              type: 'notification_type_3',
              payload: {
                id: 'uuid_notification_3',
                userId: 'uuid_test_user_3',
              },
            },
          },
        ],
      ])
    })
  })

  describe('send', () => {
    it('should prepare messages and send push and in-app', async () => {
      const usersFindByResultStub: UserEntity[] = [
        {
          id: 'uuid_test_user_1',
          username: 'test_user_1',
        },
        {
          id: 'uuid_test_user_2',
          username: 'test_user_2',
        },
        {
          id: 'uuid_test_user_3',
          username: 'test_user_3',
        },
      ] as any as UserEntity[]
      userEntityRepository.findBy.mockImplementation(async () => usersFindByResultStub)

      const userProceduresFindByResultStub = [
        {
          id: 'uuid_test_user_procedure_1',
          userId: usersFindByResultStub[0].id,
        },
        {
          id: 'uuid_test_user_procedure_2',
          userId: usersFindByResultStub[1].id,
        },
      ] as any as UserProceduresEntity[]
      userProceduresEntityRepository.findBy.mockImplementation(async () => userProceduresFindByResultStub)
      const userAppointmentsFindByResultStub = [
        {
          id: 'uuid_test_user_appointment_1',
          userId: usersFindByResultStub[0].id,
        },
        {
          id: 'uuid_test_user_appointment_2',
          userId: usersFindByResultStub[1].id,
        },
      ] as any as UserAppointmentsEntity[]
      userAppointmentsEntityRepository.findBy.mockImplementation(async () => userAppointmentsFindByResultStub)

      const rawNotificationsStub = [
        {
          notification: {
            id: 'uuid_test_notification_id',
            name: 'Test Notification',
            contentEn: 'test en text',
            contentSp: 'test sp text',
            type: 'notification_type',
          },
          userId: 'uuid_test_user_1',
          userAppointmentId: 'uuid_test_user_appointment_1',
          userProcedureId: 'uuid_test_user_procedure_1',
          sendStrategy: [SendingStrategy.push],
        },
        {
          notification: {
            id: 'uuid_test_notification_id',
            name: 'Test Notification',
            contentEn: 'test en text',
            contentSp: 'test sp text',
            type: 'notification_type',
          },
          userId: 'uuid_test_user_2',
          userAppointmentId: 'uuid_test_user_appointment_2',
          userProcedureId: 'uuid_test_user_procedure_2',
          sendStrategy: [SendingStrategy.inApp],
        },
        {
          notification: {
            id: 'uuid_test_notification_id',
            name: 'Test Notification',
            contentEn: 'test en text',
            contentSp: 'test sp text',
            type: 'notification_type',
          },
          userId: 'uuid_test_user_3',
        },
      ] as any as RawPredefinedNotification[]

      await notificationService.send(rawNotificationsStub)

      expect(userNotificationsPredefinedEntityRepository.save).toHaveBeenCalledWith([
        {
          title: 'Test Notification',
          bodyEn: 'test en text',
          bodySp: 'test sp text',
          user: {
            id: 'uuid_test_user_2',
            username: 'test_user_2',
          },
          notification: {
            id: 'uuid_test_notification_id',
            name: 'Test Notification',
            contentEn: 'test en text',
            contentSp: 'test sp text',
            type: 'notification_type',
          },
          appointment: {
            id: 'uuid_test_user_appointment_2',
            userId: usersFindByResultStub[1].id,
          },
          procedure: {
            id: 'uuid_test_user_procedure_2',
            userId: usersFindByResultStub[1].id,
          },
        },
        {
          title: 'Test Notification',
          bodyEn: 'test en text',
          bodySp: 'test sp text',
          user: {
            id: 'uuid_test_user_3',
            username: 'test_user_3',
          },
          notification: {
            id: 'uuid_test_notification_id',
            name: 'Test Notification',
            contentEn: 'test en text',
            contentSp: 'test sp text',
            type: 'notification_type',
          },
          appointment: undefined,
          procedure: undefined,
        },
      ])

      expect(firebaseService.sendNotification.mock.calls).toEqual([
        [
          ['uuid_test_user_1'],
          {
            title: 'Test Notification',
            body: 'test en text',
            imageId: null,
            data: {
              type: 'notification_type',
              payload: {
                id: 'uuid_test_notification_id',
                userId: 'uuid_test_user_1',
                userAppointmentId: 'uuid_test_user_appointment_1',
                userProcedureId: 'uuid_test_user_procedure_1',
              },
            },
          },
        ],
        [
          ['uuid_test_user_3'],
          {
            title: 'Test Notification',
            body: 'test en text',
            imageId: null,
            data: {
              type: 'notification_type',
              payload: {
                id: 'uuid_test_notification_id',
                userId: 'uuid_test_user_3',
              },
            },
          },
        ],
      ])
    })
  })
})
