import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { LessThanOrEqual, Repository } from 'typeorm'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { addMonths, addYears } from 'date-fns'
import { Gender } from '../../../../../constants/enums/gender.constants'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

@Injectable()
export class BlankMammogramService {
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

    const dateBirthUser40Old = addYears(endOfDay, -40) // if user has this date as date of birth that user is 40 old
    const dateBirthUser40Old3MonthAgo = addMonths(dateBirthUser40Old, 3) // the 3 months after the date of 40 years

    // get all females older than 40 who enabled screening test notifications and have not disabled mammograms
    const users = await this.userEntityRepository.find({
      relations: { procedures: { procedure: true }, reminders: { notification: true } },
      where: {
        isQuestionnairePassed: true,
        isAssessmentPassed: true,
        isEmailConfirmed: true,
        gender: { name: Gender.Female },
        dateOfBirth: LessThanOrEqual(dateBirthUser40Old3MonthAgo),
        settingNotifications: { mammogramEnable: true, screeningTestsEnable: true },
      },
    })

    return users.reduce((notifications: RawPredefinedNotification[], user) => {
      const userMammograms = user.procedures.filter(
        (uProc) => uProc.procedure.tag === Procedure.Mammogram && uProc.datetime,
      )
      if (
        // user have no mammograms OR
        !userMammograms.length ||
        //user have not scheduled mommograms
        (!userMammograms.some((uProc) => uProc.datetime.getTime() >= new Date().getTime()) &&
          // AND user have no blank (MammogramToSchedule) reminders
          !user.reminders.some((uRem) => uRem.notification.type === NotificationType.MammogramToSchedule))
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
