import { BaseSuccessResponse } from './../../../core/dtos/response/base-success.dto'
import { SendEmailDTO } from './support.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Req } from '@nestjs/common'
import { SupportService } from './support.service'
import { I18n, I18nContext } from 'nestjs-i18n'
import { IBaseResponse } from '../../../models/response.models'

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('send-email')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public async sendEmailToSupport(
    @Req() req,
    @Body() body: SendEmailDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const { email, username } = req.user
    const { emailBody } = body

    return this.supportService.sendEmail({ email, emailBody, username }, i18n)
  }
}
