import { NotificationEntity } from './../../../database/entities/notification.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { NotificationCrudService } from './notification.crud'
import { NotificationController } from './notifications.controller'
import { NotificationService } from './notifications.service'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationCrudService],
  exports: [],
})
export class NotificationsModule {}
