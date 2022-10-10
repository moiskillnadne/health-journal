import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Req } from '@nestjs/common'
import { UserCardHeightService } from './user-card-height.service'
import { GetUserCardHeightResponseDto } from './dto/user-card-height-response.dto'

@ApiTags('User Height')
@Controller('user/height')
export class UserCardHeightController {
  constructor(private userCardHeightService: UserCardHeightService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserCardHeightResponseDto })
  public getUserHeight(@Req() { user }) {
    return this.userCardHeightService.getUserHeight(user.id)
  }
}
