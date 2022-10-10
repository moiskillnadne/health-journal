import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { NotificationService } from './notifications.service'

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  public getNotificationsList() {
    return this.notificationService.getNotificationList()
  }
}
