import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationEntity } from '../../../database/entities/notification.entity'

@Injectable()
export class NotificationCrudService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
  ) {}

  public getNotificationList() {
    return this.notificationRepo.find()
  }
}
