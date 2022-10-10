import { Injectable } from '@nestjs/common'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { RawPredefinedNotification } from '../../dto/notifications-predefined.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { LessThanOrEqual, Repository } from 'typeorm'
import { addMonths, addYears } from 'date-fns'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { Procedure } from '../../../../../constants/enums/procedures.constants'

@Injectable()
export class BlankColonScreeningService {
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

    const dateBirthUser45Old = addYears(endOfDay, -45) // if user has this date as date of birth that user is 45 old
    const dateBirthUser45Old3MonthAgo = addMonths(dateBirthUser45Old, 3) // the 3 months after the date of 45 years

    // get all users older than 45 who enabled screening test notifications and have not disabled screening tests
    const users = await this.userEntityRepository.find({
      relations: { procedures: { procedure: true }, reminders: { notification: true } },
      where: {
        isQuestionnairePassed: true,
        isAssessmentPassed: true,
        isEmailConfirmed: true,
        dateOfBirth: LessThanOrEqual(dateBirthUser45Old3MonthAgo),
        settingNotifications: { colonScreeningEnable: true, screeningTestsEnable: true },
      },
    })
    return users.reduce((notifications: RawPredefinedNotification[], user) => {
      //to left only screening tests (with not null date to skip inconsistent legacy data)
      const userScreenings = user.procedures.filter(
        (uProc) =>
          [Procedure.Colonoscopy, Procedure.Cologuard, Procedure.Colonography, Procedure.BloodStoolTesting].includes(
            uProc.procedure.tag,
          ) && uProc.datetime,
      )
      if (
        // user have no screening test procedures OR
        !userScreenings.length ||
        //user have not scheduled screening test procedures
        (!userScreenings.some((uProc) => uProc.datetime.getTime() >= new Date().getTime()) &&
          // AND user have not blank (ColonScreeningToSchedule) reminders
          !user.reminders.some((uRem) => uRem.notification.type === NotificationType.ColonScreeningToSchedule))
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
