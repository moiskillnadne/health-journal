import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { NotificationService } from '../../notification.service'
import { ScheduledAppointmentsService } from '../../services/doctor-appointments/scheduled-appointments.service'
import { SchedulableHandlerInterface } from '../handler.interface'

@Injectable()
export class OneDayAgoHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(OneDayAgoHandler.name)
  constructor(
    private notificationService: NotificationService,
    private scheduledAppointmentsService: ScheduledAppointmentsService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.DoctorAppointmentOneDayAgo
  }

  public async handleNotifications() {
    this.logger.log('Handle Doctor Appointments "One Day Ago" notifications')
    const notifications = await this.scheduledAppointmentsService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
