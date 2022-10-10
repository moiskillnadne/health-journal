import { Injectable } from '@nestjs/common'
import { stringify } from 'csv-stringify'
import { ConfigService } from '@nestjs/config'
import { Environment } from '../../../constants/config.constants'
import { Stringifier } from 'csv-stringify'

@Injectable()
export class CsvService {
  protected tmpdir: string = this.configService.get(Environment.TmpDirPath)

  constructor(protected configService: ConfigService) {}

  public makeCsv(data: CsvConvertable): Stringifier {
    const { tColumns, tData } = data
    const stringifier = stringify({ header: true, columns: tColumns })
    tData.map((tRow) => stringifier.write(tRow))

    return stringifier
  }

  public streamToBuffer(stream: Stringifier): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const csvBuffer = Array<any>()
      stream
        .on('data', (chunk) => csvBuffer.push(chunk))
        .on('finish', () => resolve(Buffer.concat(csvBuffer)))
        .on('error', reject)
        .end()
    })
  }
}
