import { BaseSuccessResponse } from './../../../core/dtos/response/base-success.dto'
import { Body, Controller, Get, Put, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { GetUserCardWaterHistoryLatestRecordResponseDTO } from './dto/user-card-water-response.dto'
import { PostUserCardWaterParamsDTO } from './dto/user-card-water.dto'
import { UserCardWaterService } from './user-card-water.service'

@ApiTags('User Water')
@Controller('user/water')
export class UserCardWaterController {
  constructor(private userCardWaterService: UserCardWaterService) {}

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserCardWaterHistoryLatestRecordResponseDTO })
  public getLatestValue(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardWaterService.getLatestWaterRecord(user.id, i18n)
  }

  @Put()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public saveWaterValue(@Req() { user }, @I18n() i18n: I18nContext, @Body() body: PostUserCardWaterParamsDTO) {
    return this.userCardWaterService.saveWaterRecord(user.id, i18n, body)
  }
}
