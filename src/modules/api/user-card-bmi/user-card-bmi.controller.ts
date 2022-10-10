import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Req } from '@nestjs/common'

import { UserCardBmiService } from './user-card-bmi.service'

import { GetUserLastBmiResponseDto } from './dto/user-card-bmi.response.dto'

@ApiTags('User Bmi')
@Controller('user/bmi')
export class UserCardBmiController {
  constructor(private userCardBmiService: UserCardBmiService) {}

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserLastBmiResponseDto })
  public getUserLastBmi(@Req() { user }) {
    return this.userCardBmiService.getUserLastBmiByUserId(user.id)
  }
}
