import { Injectable } from '@nestjs/common'

import { defaultAssessmentScreeningTags } from '../../../../../constants/enums/assessment.constants'
import { Procedure } from '../../../../../constants/enums/procedures.constants'
import { ReminderPeriod } from '../../../../../constants/enums/reminders.constants'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'

import { ProceduresCrudService } from '../../../procedures/procedures.crud'
import { UserProceduresCrudService } from '../../../user-procedures/user-procedures.crud'
import { UserCardProfileCrudService } from '../../../user-card-profile/user-card-profile.crud'

import { UserRemindersService } from '../../../user-reminders/user-reminders.service'

import { AssessmentScreeningColonParamsDto } from './dto/assessment-screening-colon.dto'
import { AssessmentScreeningPapSmearParamsDto } from './dto/assessment-screening-pap-smear.dto'
import { AssessmentScreeningMammogramParamsDto } from './dto/assessment-screening-mammogram.dto'

import { getColonScreeningPayload } from './helpers/screening.helper'
import { utcToZonedTime } from 'date-fns-tz'

@Injectable()
export class AssessmentScreeningService {
  constructor(
    private proceduresCrudService: ProceduresCrudService,
    private userProceduresCrudService: UserProceduresCrudService,
    private userCardProfileCrudService: UserCardProfileCrudService,
    private userRemindersService: UserRemindersService,
  ) {}

  async addColonScreeningByParams(
    userId: string,
    cardId: string,
    params: AssessmentScreeningColonParamsDto,
    timezone: string,
  ): Promise<void> {
    const list = await this.proceduresCrudService.getProceduresByTagList(defaultAssessmentScreeningTags)
    const procedures = list.reduce((map, procedure) => {
      map[procedure.tag] = procedure.id
      return map
    }, {})

    if (params.bloodStoolTesting || params.cologuard || params.colonography || params.colonoscopy) {
      const colonScreeningPayload = getColonScreeningPayload(userId, params, procedures)

      await Promise.all(
        colonScreeningPayload.map(async (screening) => {
          let reminder
          let procedureName

          for (const procedure in procedures) {
            if (procedures[procedure] === screening.procedureId) {
              procedureName = params[procedure]?.name
            }
          }

          if (screening?.interval && screening?.period) {
            reminder = await this.userRemindersService.addUserReminderByProcedureId(screening.procedureId, {
              userId: screening.userId,
              interval: screening.interval,
              period: screening.period,
            })
          }

          return this.userProceduresCrudService.addUserProcedureByParams({
            userId,
            name: procedureName,
            procedureId: screening.procedureId,
            datetime: screening.datetime,
            date: utcToZonedTime(screening.datetime, timezone),
            ...(reminder?.id ? { reminderId: reminder?.id } : {}),
          })
        }),
      )

      if (params.remindColonScreeningInThreeMonth) {
        await this.userRemindersService.addUserReminderByNotificationType(NotificationType.ColonScreeningToSchedule, {
          userId,
          period: ReminderPeriod.Month,
          interval: 3,
          lastExecuteAt: new Date(),
        })
      }
    }

    if (params.noColonScreening || params.noNeedColonScreening) {
      await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
        noColonScreening: params.noColonScreening || false,
        noNeedColonScreening: params.noNeedColonScreening || false,
      })
    }
  }

  async addPapSmearScreeningByParams(
    userId: string,
    cardId: string,
    params: AssessmentScreeningPapSmearParamsDto,
    timezone: string,
  ): Promise<void> {
    const procedure = await this.proceduresCrudService.getProcedureByTag(Procedure.PapSmear)

    let reminder

    if (params?.papSmear?.interval && params?.papSmear?.period) {
      reminder = await this.userRemindersService.addUserReminderByProcedureId(params.papSmear.id, {
        userId,
        interval: params.papSmear.interval,
        period: params.papSmear.period,
      })
    }

    if (params?.papSmear) {
      await this.userProceduresCrudService.addUserProcedureByParams({
        userId,
        name: params.papSmear.name,
        procedureId: procedure.id,
        datetime: params.papSmear.datetime,
        date: utcToZonedTime(params.papSmear.datetime, timezone),
        ...(reminder?.id ? { reminderId: reminder?.id } : {}),
      })

      if (params?.remindPapSmearInThreeMonth) {
        await this.userRemindersService.addUserReminderByNotificationType(NotificationType.PapSmearToSchedule, {
          userId,
          period: ReminderPeriod.Month,
          interval: 3,
          lastExecuteAt: new Date(),
        })
      }
    }

    if (params?.noPapSmear || params?.noNeedPapSmear) {
      await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
        noPapSmear: params.noPapSmear || false,
        noNeedPapSmear: params.noNeedPapSmear || false,
      })
    }
  }

  async addMammogramScreeningByParams(
    userId: string,
    cardId: string,
    params: AssessmentScreeningMammogramParamsDto,
    timezone: string,
  ): Promise<void> {
    const procedure = await this.proceduresCrudService.getProcedureByTag(Procedure.Mammogram)

    let reminder

    if (params?.mammogram?.interval && params?.mammogram?.period) {
      reminder = await this.userRemindersService.addUserReminderByProcedureId(params.mammogram.id, {
        userId,
        interval: params.mammogram.interval,
        period: params.mammogram.period,
      })
    }

    if (params?.mammogram) {
      await this.userProceduresCrudService.addUserProcedureByParams({
        userId,
        name: params.mammogram.name,
        procedureId: procedure.id,
        datetime: params.mammogram.datetime,
        date: utcToZonedTime(params.mammogram.datetime, timezone),
        ...(reminder?.id ? { reminderId: reminder?.id } : {}),
      })
      if (params?.remindMammogramInThreeMonth) {
        await this.userRemindersService.addUserReminderByNotificationType(NotificationType.MammogramToSchedule, {
          userId,
          period: ReminderPeriod.Month,
          interval: 3,
          lastExecuteAt: new Date(),
        })
      }
    }

    if (params?.noMammogram || params?.noNeedMammogram) {
      await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
        noMammogram: params.noMammogram || false,
        noNeedMammogram: params.noNeedMammogram || false,
      })
    }
  }
}
