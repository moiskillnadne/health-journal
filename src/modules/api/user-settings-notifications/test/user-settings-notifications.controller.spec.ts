import { I18nContext } from 'nestjs-i18n'
import { Test } from '@nestjs/testing'
import { UserSettingsNotificationsController } from '../user-settings-notifications.controller'
import { UserSettingsNotificationsService } from '../user-settings-notifications.service'
import { UserSettingsNotificationsCrudService } from '../user-settings-notifications.crud'
import { InternalServerError } from '../../../../core/errors/internal-server.error'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { UserSettingsNotificationsEntity } from '../../../../database/entities/user-settings-notifications.entity'
import { NotificationsDTO } from '../user-settings-notifications.dto'

const getRequestUserStub = () => ({
  user: {
    id: 'uuid',
    firstName: 'Test',
    lastName: 'User',
    username: 'test_user',
    email: 'test_user@test.com',
  },
})

const getStoredUserSettingNotifications = (userId): UserSettingsNotificationsEntity => ({
  id: 'stored_user_setting_notifications_id',
  pushNotificationsEnable: true,
  myWellnessJourneytasksEnable: true,
  newsAndUpdatesEnable: true,
  medicationRemindersEnable: true,
  doctorAppointmentsEnable: true,
  screeningTestsEnable: true,
  colonScreeningEnable: undefined,
  mammogramEnable: undefined,
  papSmearEnable: undefined,
  eyeExamEnable: true,
  scheduleAnAppointmentEnable: true,
  vitalsCheckEnable: true,
  waterIntakeEnable: true,
  user: undefined,
  userId,
  createAt: new Date('2022-01-01 00:00:00'),
  updateAt: new Date('2022-01-01 00:00:00'),
})

const getUserSettingNotificationsUpdateRequestBody = (): NotificationsDTO => ({
  pushNotificationsEnable: false,
  myWellnessJourneytasksEnable: true,
  newsAndUpdatesEnable: true,
  medicationRemindersEnable: true,
  doctorAppointmentsEnable: true,
  screeningTestsEnable: true,
  eyeExamEnable: true,
  scheduleAnAppointmentEnable: false,
  vitalsCheckEnable: true,
  waterIntakeEnable: true,
})

const getUserSettingNotificationsUpdateParamsPreparedToSave = (): NotificationsDTO => ({
  pushNotificationsEnable: false,
  myWellnessJourneytasksEnable: false,
  newsAndUpdatesEnable: false,
  medicationRemindersEnable: true,
  doctorAppointmentsEnable: true,
  screeningTestsEnable: true,
  eyeExamEnable: true,
  scheduleAnAppointmentEnable: false,
  vitalsCheckEnable: true,
  waterIntakeEnable: true,
})

const getUserSettingNotificationsExpectedUpdateResult = (userId): UserSettingsNotificationsEntity => ({
  id: 'updated_user_setting_notifications_id',
  pushNotificationsEnable: false,
  myWellnessJourneytasksEnable: false,
  newsAndUpdatesEnable: false,
  medicationRemindersEnable: true,
  doctorAppointmentsEnable: true,
  screeningTestsEnable: true,
  colonScreeningEnable: undefined,
  mammogramEnable: undefined,
  papSmearEnable: undefined,
  eyeExamEnable: true,
  scheduleAnAppointmentEnable: false,
  vitalsCheckEnable: true,
  waterIntakeEnable: true,
  user: undefined,
  userId,
  createAt: new Date('2022-01-01 00:00:00'),
  updateAt: new Date('2022-01-01 00:00:00'),
})

describe('UserSettingsNotificationsController', () => {
  let userSettingsNotificationsController: UserSettingsNotificationsController
  let userSettingsNotificationsService: UserSettingsNotificationsService
  let userSettingsNotificationsCrudService: UserSettingsNotificationsCrudService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserSettingsNotificationsController],
      providers: [
        UserSettingsNotificationsService,
        {
          provide: UserSettingsNotificationsCrudService,
          useValue: {
            getNotificationsByUserId: jest.fn(),
            upsertNotificationByUserId: jest.fn(),
            createInititalNotifications: jest.fn(),
          },
        },
      ],
    }).compile()

    userSettingsNotificationsController = moduleRef.get<UserSettingsNotificationsController>(
      UserSettingsNotificationsController,
    )
    userSettingsNotificationsService = moduleRef.get<UserSettingsNotificationsService>(UserSettingsNotificationsService)
    userSettingsNotificationsCrudService = moduleRef.get<UserSettingsNotificationsCrudService>(
      UserSettingsNotificationsCrudService,
    )
  })

  afterEach(() => jest.clearAllMocks())

  const I18nContextStub = {
    t: jest.fn(),
  } as unknown as I18nContext

  describe('updateNotificationByUserId', () => {
    describe('when updateNotificationByUserId is called and user has not related notification setting entity', () => {
      const requestStub = getRequestUserStub()
      it('then it should create user setting notifications', async () => {
        jest
          .spyOn(userSettingsNotificationsCrudService, 'getNotificationsByUserId')
          .mockImplementation(async () => null)
        jest.spyOn(userSettingsNotificationsCrudService, 'upsertNotificationByUserId')
        jest
          .spyOn(userSettingsNotificationsCrudService, 'createInititalNotifications')
          .mockImplementation(async () => getUserSettingNotificationsExpectedUpdateResult(requestStub.user.id))

        const result = await userSettingsNotificationsController.updateNotificationByUserId(
          requestStub,
          getUserSettingNotificationsUpdateRequestBody(),
          I18nContextStub,
        )

        expect(userSettingsNotificationsCrudService.upsertNotificationByUserId).not.toBeCalled()
        expect(userSettingsNotificationsCrudService.createInititalNotifications).toBeCalledWith(
          requestStub.user.id,
          getUserSettingNotificationsUpdateParamsPreparedToSave(),
        )
        expect(result).toEqual(getUserSettingNotificationsExpectedUpdateResult(requestStub.user.id))
      })
    })
    describe('when updateNotificationByUserId is called and user has related notification setting entity', () => {
      const requestStub = getRequestUserStub()
      it('then it should update user setting notifications', async () => {
        jest
          .spyOn(userSettingsNotificationsCrudService, 'getNotificationsByUserId')
          .mockImplementation(async () => getStoredUserSettingNotifications(requestStub.user.id))
        jest
          .spyOn(userSettingsNotificationsCrudService, 'upsertNotificationByUserId')
          .mockImplementation(async () => getUserSettingNotificationsExpectedUpdateResult(requestStub.user.id))
        jest.spyOn(userSettingsNotificationsCrudService, 'createInititalNotifications')

        const result = await userSettingsNotificationsController.updateNotificationByUserId(
          requestStub,
          getUserSettingNotificationsUpdateRequestBody(),
          I18nContextStub,
        )

        expect(userSettingsNotificationsCrudService.createInititalNotifications).not.toBeCalled()
        expect(userSettingsNotificationsCrudService.upsertNotificationByUserId).toBeCalledWith(
          requestStub.user.id,
          getUserSettingNotificationsUpdateParamsPreparedToSave(),
        )
        expect(result).toEqual(getUserSettingNotificationsExpectedUpdateResult(requestStub.user.id))
      })
    })
  })

  describe('getUserNotificationByUserId', () => {
    describe('when getUserNotificationByUserId is called and got DB error', () => {
      const requestStub = getRequestUserStub()
      it('then it should throw Internal Error with code: InternalServerError', async () => {
        jest.spyOn(userSettingsNotificationsCrudService, 'getNotificationsByUserId').mockImplementation(() => {
          throw new Error()
        })
        let gotErr
        try {
          await userSettingsNotificationsController.getUserNotificationByUserId(requestStub, I18nContextStub)
        } catch (e) {
          gotErr = e
        }
        expect(gotErr).toBeInstanceOf(InternalServerError)
        expect(gotErr).toHaveProperty('code', ErrorCodes.InternalServerError)
      })
    })
    describe('when getUserNotificationByUserId is called and user has not related notification setting entity', () => {
      const requestStub = getRequestUserStub()
      it('then it should throw Internal Error with code: EntityNotFound', async () => {
        jest
          .spyOn(userSettingsNotificationsCrudService, 'getNotificationsByUserId')
          .mockImplementation(async () => null)
        let gotErr
        try {
          await userSettingsNotificationsController.getUserNotificationByUserId(requestStub, I18nContextStub)
        } catch (e) {
          gotErr = e
        }
        expect(gotErr).toBeInstanceOf(InternalServerError)
        expect(gotErr).toHaveProperty('code', ErrorCodes.EntityNotFound)
      })
    })
    describe('when getUserNotificationByUserId', () => {
      const requestStub = getRequestUserStub()
      it('then it should return value', async () => {
        jest
          .spyOn(userSettingsNotificationsCrudService, 'getNotificationsByUserId')
          .mockImplementation(async () => getStoredUserSettingNotifications(requestStub.user.id))

        expect(
          await userSettingsNotificationsController.getUserNotificationByUserId(requestStub, I18nContextStub),
        ).toEqual(getStoredUserSettingNotifications(requestStub.user.id))
      })
    })
  })
})
