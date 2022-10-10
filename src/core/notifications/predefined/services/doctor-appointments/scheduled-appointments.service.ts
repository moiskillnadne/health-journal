import { Injectable } from '@nestjs/common'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'
import { notificationAppointmentsTypesToNotifiablePeriods } from '../../../notifications.constants'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { addDays, isSameDay } from 'date-fns'

@Injectable()
export class ScheduledAppointmentsService {
  constructor(
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
    @InjectRepository(UserEntity) private userEntityRepository: Repository<UserEntity>,
  ) {}

  public async collectNotifications(notificationType: NotificationType): Promise<RawPredefinedNotification[]> {
    const notification = await this.notificationPredefinedEntityRepository.findOne({
      where: { type: notificationType },
      relations: { video: true },
    })
    // get all users with enabled setting
    const users = await this.userEntityRepository.find({
      relations: { appointments: true },
      where: {
        isQuestionnairePassed: true,
        isAssessmentPassed: true,
        isEmailConfirmed: true,
        settingNotifications: { scheduleAnAppointmentEnable: true },
      },
    })
    //calculate target date
    const targetInterval = notificationAppointmentsTypesToNotifiablePeriods[notificationType]
    const targetDate = addDays(new Date(), targetInterval)

    return users.reduce((notifications: RawPredefinedNotification[], user) => {
      //skip users without appointments
      if (user.appointments?.length) {
        for (const uAppointment of user.appointments) {
          //take only user appointments that was or will in target date
          if (uAppointment.datetime && isSameDay(uAppointment.datetime, targetDate)) {
            notifications.push({
              userId: user.id,
              notification: notification,
              userAppointmentId: uAppointment.id,
            })
          }
        }
      }
      return notifications
    }, [])
  }
}
