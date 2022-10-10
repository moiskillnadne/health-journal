import { Injectable } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { notificationEyeExamTypesToNotifiablePeriods } from '../../../notifications.constants'
import { addDays, isSameDay } from 'date-fns'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

@Injectable()
export class ScheduledEyeExamService {
  constructor(
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
    @InjectRepository(UserEntity) private userEntityRepository: Repository<UserEntity>,
  ) {}

  public async collectNotifications(notificationType: NotificationType): Promise<RawPredefinedNotification[]> {
    const notification = await this.notificationPredefinedEntityRepository.findOne({
      relations: { procedure: true },
      where: { type: notificationType },
    })
    //get all users with eye exams and with enabled setting
    const users = await this.userEntityRepository.find({
      relations: { procedures: { procedure: true } },
      where: {
        isQuestionnairePassed: true,
        isAssessmentPassed: true,
        isEmailConfirmed: true,
        procedures: {
          procedure: { tag: Procedure.DiabeticEyeExam },
        },
        settingNotifications: { eyeExamEnable: true },
      },
    })
    //calculate target date
    const targetInterval = notificationEyeExamTypesToNotifiablePeriods[notificationType]
    const targetDate = addDays(new Date(), targetInterval)

    return users.reduce((notifications: RawPredefinedNotification[], user) => {
      //skip users without eye exams
      if (user.procedures?.length) {
        for (const uProcedure of user.procedures) {
          if (uProcedure.datetime && isSameDay(uProcedure.datetime, targetDate)) {
            notifications.push({
              userId: user.id,
              notification: notification,
              userProcedureId: uProcedure.id,
            })
          }
        }
      }
      return notifications
    }, [])
  }
}
