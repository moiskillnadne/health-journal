import { BaseSuccessResponse } from './../../../core/dtos/response/base-success.dto'
import { UserSettingsService } from './services/user-settings.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Req } from '@nestjs/common'
import { LanguageBodyDTO, MeasurementsBodyDTO } from './user-settings.dto'
import { I18n, I18nContext } from 'nestjs-i18n'
import { IBaseResponse } from '../../../models/response.models'

@ApiTags('User Settings')
@Controller('user/settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post('language')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async setLanguage(
    @Body() languageBody: LanguageBodyDTO,
    @Req() req,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const { language } = languageBody

    return this.userSettingsService.saveUserLanguage(req.user.id, language, i18n)
  }

  @Post('measurements')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public setMeasurements(
    @Body() measurementsBody: MeasurementsBodyDTO,
    @Req() req,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const { measurements } = measurementsBody

    return this.userSettingsService.saveUserMeasurements(req.user.id, measurements, i18n)
  }
}
