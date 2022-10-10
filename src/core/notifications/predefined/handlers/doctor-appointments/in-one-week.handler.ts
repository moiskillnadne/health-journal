import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { NotificationService } from '../../notification.service'
import { ScheduledAppointmentsService } from '../../services/doctor-appointments/scheduled-appointments.service'
import { SchedulableHandlerInterface } from '../handler.interface'

@Injectable()
export class InOneWeekHandler implements SchedulableHandlerInterface {
  private readonly logger = new Logger(InOneWeekHandler.name)
  constructor(
    private notificationService: NotificationService,
    private scheduledAppointmentsService: ScheduledAppointmentsService,
  ) {}

  public getNotificationType(): NotificationType {
    return NotificationType.DoctorAppointmentInOneWeek
  }

  public async handleNotifications() {
    this.logger.log('Handle Doctor Appointments "In One Week" notifications')
    const notifications = await this.scheduledAppointmentsService.collectNotifications(this.getNotificationType())
    this.logger.log(`Got ${notifications.length} notifications`)
    await this.notificationService.send(notifications)
  }
}
