import { InternalServerError } from './../../../../core/errors/internal-server.error'
import { I18nContext } from 'nestjs-i18n'
import { IBaseResponse } from './../../../../models/response.models'
import { Measurements } from './../../../../constants/measurements'
import { Language } from './../../../../constants/language'
import { UserSettingsEntityService } from './entity/user-settings-entity.service'
import { HttpStatus, Injectable } from '@nestjs/common'
import { UserCrudService } from '../../user/user.crud'
import { SuccessCodes } from '../../../../constants/responses/codes.success.constants'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'

@Injectable()
export class UserSettingsService {
  constructor(protected settingsEntityService: UserSettingsEntityService, protected userCrudService: UserCrudService) {}

  public async saveUserLanguage(userId: string, language: Language, i18n: I18nContext): Promise<IBaseResponse> {
    const settings = await this.settingsEntityService.getUserSettingsByUserId(userId)

    try {
      if (settings) {
        await this.settingsEntityService.updateLanguageByUserId(userId, language)
      } else {
        await this.settingsEntityService.setUserLanguage(userId, language)
      }
    } catch (e) {
      throw new InternalServerError(i18n.t(DictionaryPathToken.InternalServerError), ErrorCodes.InternalServerError)
    }

    return {
      code: SuccessCodes.LanguageUpdated,
      message: i18n.t(DictionaryPathToken.UserLanguageUpdated),
      httpCode: HttpStatus.OK,
    }
  }

  public async saveUserMeasurements(
    userId: string,
    measurements: Measurements,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const settings = await this.settingsEntityService.getUserSettingsByUserId(userId)

    try {
      if (settings) {
        await this.settingsEntityService.updateMeasurementsByUserId(userId, measurements)
      } else {
        await this.settingsEntityService.setUserMeasurements(userId, measurements)
      }
    } catch (e) {
      throw new InternalServerError(i18n.t(DictionaryPathToken.InternalServerError), ErrorCodes.InternalServerError)
    }

    return {
      code: SuccessCodes.MeasurementsUpdated,
      message: i18n.t(DictionaryPathToken.UserMeasurementUpdated),
      httpCode: HttpStatus.OK,
    }
  }
}
