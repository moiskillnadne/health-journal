import { Readable } from 'stream'
import { Controller, Get, Req, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { ShareService } from './share.service'
import { Response } from 'express'
import { Measurement } from '../../../core/decorators/measurement-system.decorator'
import { Measurements } from '../../../constants/measurements'

@ApiTags('Share')
@Controller('share')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get('health-record')
  public async shareHealthRecord(
    @Res() res: Response,
    @Req() { user },
    @I18n() i18n: I18nContext,
    @Measurement() system: Measurements,
  ) {
    let pdfFile: Readable | InternalServerError | undefined
    try {
      pdfFile = await this.shareService.getPdfStream(user, i18n, system)
    } catch (e) {
      throw e
    }

    if (pdfFile instanceof Readable) {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
      })
      pdfFile.pipe(res)
    }
  }
}
