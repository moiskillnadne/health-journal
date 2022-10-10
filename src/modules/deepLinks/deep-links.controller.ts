import { Controller, Get, StreamableFile, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { createReadStream } from 'fs'
import { join } from 'path'
import { Public } from '../../core/decorators/public-route.decorator'

@ApiTags('.well-known')
@Public()
@Controller('.well-known')
export class DeepLinksController {
  @Get('apple-app-site-association')
  public getAppleManifest(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), '.well-known', 'apple-app-site-association'))
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="apple-app-site-association"',
    })
    return new StreamableFile(file)
  }

  @Get('assetlinks.json')
  public getAndroidManifest(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), '.well-known', 'assetlinks.json'))
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="assetlinks.json"',
    })
    return new StreamableFile(file)
  }
}
