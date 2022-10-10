import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import { SesService } from '../../../integrations/ses/ses.service'
import { IBaseResponse } from '../../../models/response.models'
import { EmailDetailsDTO } from './support.dto'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ConfigService } from '@nestjs/config'
import { Environment } from '../../../constants/config.constants'

@Injectable()
export class SupportService {
  constructor(private sesService: SesService, private configService: ConfigService) {}

  public async sendEmail(emailDetails: EmailDetailsDTO, i18n: I18nContext): Promise<IBaseResponse> {
    const result = await this.sesService.sendEmail({
      to: this.configService.get(Environment.SesToAddressEmail),
      subject: 'EMAIL_SUBJECT',
      message: `
            User email: ${emailDetails.email}
            User username: ${emailDetails.username}

            ${emailDetails.emailBody}
            `,
    })
    return {
      message: i18n.t(DictionaryPathToken.SupportEmailSentSuccessfully),
      code: SuccessCodes.EmailSent,
      httpCode: HttpStatus.OK,
      details: { ...result },
    }
  }
}
