import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { LessThanOrEqual, Repository } from 'typeorm'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { Gender } from '../../../../../constants/enums/gender.constants'
import { addMonths, addYears } from 'date-fns'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

@Injectable()
export class BlankPapSmearService {
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
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999))

    const dateBirthUser21Old = addYears(endOfDay, -21) // if user has this date as date of birth that user is 21 old
    const dateBirthUser21Old3MonthAgo = addMonths(dateBirthUser21Old, 3) // the 3 months after the date of 21 years

    //get all females older than 21 who enabled screening test notifications and have not disabled pap smear
    const users = await this.userEntityRepository.find({
      relations: { procedures: { procedure: true }, reminders: { notification: true } },
      where: {
        isQuestionnairePassed: true,
        isAssessmentPassed: true,
        isEmailConfirmed: true,
        gender: { name: Gender.Female },
        dateOfBirth: LessThanOrEqual(dateBirthUser21Old3MonthAgo),
        settingNotifications: { screeningTestsEnable: true, papSmearEnable: true },
      },
    })

    return users.reduce((notifications: RawPredefinedNotification[], user) => {
      const userPapSmears = user.procedures.filter(
        (uProc) => uProc.procedure.tag === Procedure.PapSmear && uProc.datetime,
      )
      if (
        //user have pap smear procedures OR
        !userPapSmears.length ||
        // ( user have not scheduled pap smear procedures AND
        (!userPapSmears.some((uProc) => uProc.datetime.getTime() >= new Date().getTime()) &&
          // user have not blank (PapSmearToSchedule) reminders )
          !user.reminders.some((uRem) => uRem.notification.type === NotificationType.PapSmearToSchedule))
      ) {
        notifications.push({
          userId: user.id,
          notification: notification,
        })
      }

      return notifications
    }, [])
  }
}
