import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { In, Repository } from 'typeorm'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { TargetGroup } from '../../../../../constants/enums/target-group.constants'
import { addMonths, isSameDay } from 'date-fns'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

@Injectable()
export class ToExpireEyeExamService {
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
    //get all users with diabetes 1 or 2 with enabled setting and DiabeticEyeExam procedures
    const users = await this.userEntityRepository.find({
      relations: {
        procedures: { procedure: true },
        reminders: { notification: true },
      },
      where: {
        isQuestionnairePassed: true,
        isAssessmentPassed: true,
        isEmailConfirmed: true,
        targetGroups: {
          targetGroup: { tag: In([TargetGroup.DiabetesType1, TargetGroup.DiabetesType2]) },
        },
        procedures: {
          procedure: { tag: Procedure.DiabeticEyeExam },
        },
        settingNotifications: { eyeExamEnable: true },
      },
    })

    const date11MothAgo = addMonths(new Date(), -11)

    return users.reduce((notifications: RawPredefinedNotification[], user) => {
      //eye exams that were 11 month ago
      const targetEyeExams = user.procedures.filter(
        (uProc) => uProc.datetime && isSameDay(uProc.datetime, date11MothAgo),
      )
      if (
        // user had eye exams 11 month ago
        targetEyeExams.length &&
        //user have not eye Exams after target
        !user.procedures.some((uProc) => uProc.datetime.getTime() > targetEyeExams[0].datetime.getTime()) &&
        //user have not scheduled eye Exams
        !user.procedures.some((uProc) => uProc.datetime.getTime() >= new Date().getTime()) &&
        // AND user have not blank (DiabeticEyeExamToSchedule) reminders
        !user.reminders.some((uRem) => uRem.notification.type === NotificationType.DiabeticEyeExamToSchedule)
      ) {
        notifications.push({
          userId: user.id,
          notification: notification,
          userProcedureId: targetEyeExams[0].id,
        })
      }

      return notifications
    }, [])
  }
}
