import { Environment } from './../../constants/config.constants'
import { ConfigService } from '@nestjs/config'
import { HttpStatus, Injectable } from '@nestjs/common'
import { AWSError, Credentials, SES } from 'aws-sdk'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'
import { InternalServerError } from '../../core/errors/internal-server.error'

@Injectable()
export class SesService {
  private sesClient: SES

  private region = this.configService.get(Environment.SesRegion)
  private endpoint = this.configService.get(Environment.SesEndpoint)

  private config: SES.Types.ClientConfiguration = {
    region: this.region,
    endpoint: this.endpoint,
    credentials: new Credentials(
      this.configService.get(Environment.AwsAccessKey),
      this.configService.get(Environment.AwsSecretAccesskey),
    ),
  }

  constructor(private configService: ConfigService) {
    this.sesClient = new SES(this.config)
  }

  public async sendEmail({
    to,
    from,
    subject,
    message,
  }: {
    to: string | string[]
    from?: string
    subject: string
    message: string
  }): Promise<SES.Types.SendEmailResponse | AWSError> {
    const params: SES.Types.SendEmailRequest = {
      Source: from ? from : `admin@${this.configService.get(Environment.SesSourceEmail)}`,
      Destination: {
        ToAddresses: typeof to === 'string' ? [to] : to,
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
        Body: {
          Text: {
            Data: message,
            Charset: 'UTF-8',
          },
        },
      },
    }

    try {
      const result = await this.sesClient.sendEmail(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsS3InternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }
}
