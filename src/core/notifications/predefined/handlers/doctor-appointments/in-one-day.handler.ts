import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { NotificationService } from '../../notification.service'
import { ScheduledAppointmentsService } from '../../services/doctor-appointments/scheduled-appointments.service'
import { SchedulableHandlerInterface } from '../handler.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InOneDayHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(InOneDayHandler.name)
  constructor(
    private notificationService: NotificationService,
    private scheduledAppointmentsService: ScheduledAppointmentsService,
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.DoctorAppointmentInOneDay
  }

  public async handleNotifications() {
    this.logger.log('Handle Doctor Appointments "In One Day" notifications')
    const notifications = await this.scheduledAppointmentsService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
