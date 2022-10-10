import { NotificationCrudService } from './notification.crud'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationService {
  constructor(private notificationCrudService: NotificationCrudService) {}

  public getNotificationList() {
    return this.notificationCrudService.getNotificationList()
  }
}
