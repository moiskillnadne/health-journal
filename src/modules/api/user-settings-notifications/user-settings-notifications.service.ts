import { UserSettingsNotificationsEntity } from '../../../database/entities/user-settings-notifications.entity'
import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { I18nContext } from 'nestjs-i18n'
import { InternalServerError } from './../../../core/errors/internal-server.error'
import { HttpStatus, Injectable } from '@nestjs/common'
import { UserSettingsNotificationsCrudService } from './user-settings-notifications.crud'
import { NotificationsDTO } from './user-settings-notifications.dto'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'

@Injectable()
export class UserSettingsNotificationsService {
  constructor(private userSettingsNotificationsCrudService: UserSettingsNotificationsCrudService) {}

  public async getNotificationsById(id: string, i18n: I18nContext): Promise<UserSettingsNotificationsEntity> {
    let result: UserSettingsNotificationsEntity | null
    try {
      result = await this.userSettingsNotificationsCrudService.getNotificationsById(id)
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.InternalServerError),
        ErrorCodes.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      )
    }

    if (!result) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.SettingsNotificationsNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    return result
  }

  public async getNotificationsByUserId(id: string, i18n: I18nContext): Promise<UserSettingsNotificationsEntity> {
    let result: UserSettingsNotificationsEntity | null

    try {
      result = await this.userSettingsNotificationsCrudService.getNotificationsByUserId(id)
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.InternalServerError),
        ErrorCodes.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      )
    }

    if (!result) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.SettingsNotificationsNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    return result
  }

  public async saveUserNotificationsByUserId(
    userId: string,
    saveBody: NotificationsDTO,
    i18n: I18nContext,
  ): Promise<UserSettingsNotificationsEntity> {
    const notifications = await this.userSettingsNotificationsCrudService.getNotificationsByUserId(userId)

    const preparedNotificationFields = this.prepareNotificationFields(saveBody)

    try {
      if (notifications) {
        const notificationResult = await this.userSettingsNotificationsCrudService.upsertNotificationByUserId(
          userId,
          preparedNotificationFields,
        )

        if (!notificationResult) {
          throw new InternalServerError(
            i18n.t(DictionaryPathToken.UpdatedFailed),
            ErrorCodes.NotUpdated,
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }

        return notificationResult
      } else {
        const result = await this.userSettingsNotificationsCrudService.createInititalNotifications(
          userId,
          preparedNotificationFields,
        )

        return result
      }
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.InternalServerError),
        ErrorCodes.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      )
    }
  }

  private prepareNotificationFields(saveBody: NotificationsDTO): NotificationsDTO {
    let notificationFields: NotificationsDTO = { ...saveBody }

    if (notificationFields.pushNotificationsEnable !== undefined) {
      const sectionValue = notificationFields.pushNotificationsEnable

      notificationFields = {
        ...notificationFields,
        myWellnessJourneytasksEnable: sectionValue,
        newsAndUpdatesEnable: sectionValue,
      }
    }

    return notificationFields
  }
}
