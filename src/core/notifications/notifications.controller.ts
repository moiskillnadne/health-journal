import { Body, Controller, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { Public } from '../decorators/public-route.decorator'

import { BaseSuccessResponse } from '../dtos/response/base-success.dto'

import { NotificationsRemindBodyParamsDto, NotificationsStopBodyParamsDto } from './dto/notifications.dto'

import { NotificationsService } from './notifications.service'

@ApiTags('Notifications')
@Public()
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('remind')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public upsertUserProcedureReminders(@Body() params: NotificationsRemindBodyParamsDto) {
    return this.notificationsService.upsertUserProcedureRemindersByParams(params)
  }

  @Post('stop')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public removeUserProcedureReminders(@Body() params: NotificationsStopBodyParamsDto) {
    return this.notificationsService.removeUserProcedureRemindersByParams(params)
  }
}
