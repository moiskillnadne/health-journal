import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { convertMgDlToMmolL, convertMmolLToMgDl } from '../../../../../core/measurements/blood-sugar.converter'

import { InternalServerError } from '../../../../../core/errors/internal-server.error'

import { DictionaryPathToken } from '../../../../../constants/dictionary.constants'
import { Procedure } from '../../../../../constants/enums/procedures.constants'
import { ErrorCodes } from '../../../../../constants/responses/codes.error.constants'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'
import { ReminderPeriod } from '../../../../../constants/enums/reminders.constants'

import { UserCrudService } from '../../../user/user.crud'
import { UserCardCrudService } from '../../../user-card/user-card.crud'
import { UserCardWeightCrudService } from '../../../user-card-weight/user-card-weight.crud'
import { UserConditionsCrudService } from '../../../user-conditions/user-conditions.crud'
import { ProceduresCrudService } from '../../../procedures/procedures.crud'
import { UserProceduresCrudService } from '../../../user-procedures/user-procedures.crud'
import { UserCardHba1cCrudService } from '../../../user-card-hba1c/user-card-hba1c.crud'
import { UserCardRandomBloodSugarCrudService } from '../../../user-card-random-blood-sugar/user-card-random-blood-sugar.crud'
import { UserCardFastingBloodSugarCrudService } from '../../../user-card-fasting-blood-sugar/user-card-fasting-blood-sugar.crud'
import { UserCardAfterMealBloodSugarCrudService } from '../../../user-card-after-meal-blood-sugar/user-card-after-meal-blood-sugar.crud'
import { UserCardLdlLevelCrudService } from '../../../user-card-ldl-level/user-card-ldl-level.crud'
import { UserCardTriglycerideLevelCrudService } from '../../../user-card-triglyceride-level/user-card-triglyceride-level.crud'
import { UserMedicationsService } from '../../../user-medications/user-medications.service'
import { UserCardBloodPressureCrudService } from '../../../user-card-blood-pressure/user-card-blood-pressure.crud'
import { UserCardProfileCrudService } from '../../../user-card-profile/user-card-profile.crud'
import { UserAppointmentsCrudService } from '../../../user-appointments/user-appointments.crud'

import { UserRemindersService } from '../../../user-reminders/user-reminders.service'

import { ConditionsParamsDto } from './dto/assessment-health-conditions.dto'
import { AssessmentHealthInfoParamsDto } from './dto/assessment-health-info.dto'
import { AssessmentHealthQuestionsParamsDto } from './dto/assessment-health-questions.dto'
import { AssessmentHealthAppointmentsParamsDto } from './dto/assessment-health-appointments.dto'

@Injectable()
export class AssessmentHealthService {
  constructor(
    private userCrudService: UserCrudService,
    private userCardCrudService: UserCardCrudService,
    private userCardWeightCrudService: UserCardWeightCrudService,
    private userConditionsCrudService: UserConditionsCrudService,
    private proceduresCrudService: ProceduresCrudService,
    private userProceduresCrudService: UserProceduresCrudService,
    private userCardHba1cCrudService: UserCardHba1cCrudService,
    private userCardRandomBloodSugarCrudService: UserCardRandomBloodSugarCrudService,
    private userCardFastingBloodSugarCrudService: UserCardFastingBloodSugarCrudService,
    private userCardAfterMealBloodSugarCrudService: UserCardAfterMealBloodSugarCrudService,
    private userCardLdlLevelCrudService: UserCardLdlLevelCrudService,
    private userCardTriglycerideLevelCrudService: UserCardTriglycerideLevelCrudService,
    private userMedicationsService: UserMedicationsService,
    private userCardBloodPressureCrudService: UserCardBloodPressureCrudService,
    private userCardProfileCrudService: UserCardProfileCrudService,
    private userAppointmentsCrudService: UserAppointmentsCrudService,
    private userRemindersService: UserRemindersService,
  ) {}

  async addConditionsByUserId(id: string, params: ConditionsParamsDto[]): Promise<void> {
    if (params.length > 0) {
      await this.userConditionsCrudService.addUserConditionsByParams(
        params.map((condition) => ({
          userId: id,
          conditionId: condition.id,
          info: condition.info || null,
        })),
      )
    }
  }

  async addMoreHealthInfoByParams(
    userId: string,
    cardId: string,
    params: AssessmentHealthInfoParamsDto,
    i18n: I18nContext,
  ): Promise<void> {
    const procedure = await this.proceduresCrudService.getProcedureByTag(Procedure.DiabeticEyeExam)

    if (!procedure) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.ProcedureNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          tag: Procedure.DiabeticEyeExam,
        },
      )
    }

    if (params.lastDiabeticEyeExam) {
      await this.userProceduresCrudService.addUserProcedureByParams({
        userId,
        procedureId: procedure.id,
        datetime: params.lastDiabeticEyeExam,
      })
    }

    if (params.nextDiabeticEyeExam) {
      await this.userProceduresCrudService.addUserProcedureByParams({
        userId,
        procedureId: procedure.id,
        datetime: params.nextDiabeticEyeExam,
      })
    }

    if (params.noDiabeticEyeExam) {
      await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
        noDiabeticEyeExam: params.noDiabeticEyeExam,
      })
    }

    if (params.remindDiabeticEyeExamInOneMonth) {
      await this.userRemindersService.addUserReminderByNotificationType(NotificationType.DiabeticEyeExamToSchedule, {
        userId,
        period: ReminderPeriod.Month,
        interval: 1,
        lastExecuteAt: new Date(),
      })
    }

    await this.userCardCrudService.updateUserCardById(cardId, {
      goalRandomBloodSugarMgDl:
        params.goalRandomBloodSugar?.mgDl ||
        (params.goalRandomBloodSugar?.mmolL && convertMmolLToMgDl(params.goalRandomBloodSugar.mmolL)),
      goalRandomBloodSugarMmolL:
        params.goalRandomBloodSugar?.mmolL ||
        (params.goalRandomBloodSugar?.mgDl && convertMgDlToMmolL(params.goalRandomBloodSugar.mgDl)),
      goalFastingBloodSugarMgDl:
        params.goalFastingBloodSugar?.mgDl ||
        (params.goalFastingBloodSugar?.mmolL && convertMmolLToMgDl(params.goalFastingBloodSugar.mmolL)),
      goalFastingBloodSugarMmolL:
        params.goalFastingBloodSugar?.mmolL ||
        (params.goalFastingBloodSugar?.mgDl && convertMgDlToMmolL(params.goalFastingBloodSugar.mgDl)),
      goalAfterMealBloodSugarMgDl:
        params.goalAfterMealBloodSugar?.mgDl ||
        (params.goalAfterMealBloodSugar?.mmolL && convertMmolLToMgDl(params.goalAfterMealBloodSugar.mmolL)),
      goalAfterMealBloodSugarMmolL:
        params.goalAfterMealBloodSugar?.mmolL ||
        (params.goalAfterMealBloodSugar?.mgDl && convertMgDlToMmolL(params.goalAfterMealBloodSugar.mgDl)),
      goalLdlMgDl: params.goalLdl?.mgDl || (params.goalLdl?.mmolL && convertMmolLToMgDl(params.goalLdl.mmolL)),
      goalLdlMmolL: params.goalLdl?.mmolL || (params.goalLdl?.mgDl && convertMgDlToMmolL(params.goalLdl.mgDl)),
      goalHba1c: params.goalHba1c,
      cpap: params.cpap,
    })

    if (params.hba1c) {
      await this.userCardHba1cCrudService.addUserHba1cByCardId(cardId, {
        percent: params.hba1c.percent,
        datetime: params.hba1c.datetime,
      })
    }

    if (params.randomBloodSugar) {
      await this.userCardRandomBloodSugarCrudService.addUserRandomBloodSugarByCardId(cardId, {
        sugarMgDl: params.randomBloodSugar.mgDl || convertMmolLToMgDl(params.randomBloodSugar.mmolL),
        sugarMmolL: params.randomBloodSugar.mmolL || convertMgDlToMmolL(params.randomBloodSugar.mgDl),
      })
    }

    if (params.fastingBloodSugar) {
      await this.userCardFastingBloodSugarCrudService.addUserFastingBloodSugarByCardId(cardId, {
        sugarMgDl: params.fastingBloodSugar.mgDl || convertMmolLToMgDl(params.fastingBloodSugar.mmolL),
        sugarMmolL: params.fastingBloodSugar.mmolL || convertMgDlToMmolL(params.fastingBloodSugar.mgDl),
      })
    }

    if (params.afterMealBloodSugar) {
      await this.userCardAfterMealBloodSugarCrudService.addUserAfterMealBloodSugarByCardId(cardId, {
        sugarMgDl: params.afterMealBloodSugar.mgDl || convertMmolLToMgDl(params.afterMealBloodSugar.mmolL),
        sugarMmolL: params.afterMealBloodSugar.mmolL || convertMgDlToMmolL(params.afterMealBloodSugar.mgDl),
      })
    }

    if (params.ldl) {
      await this.userCardLdlLevelCrudService.addUserLdlLevelByCardId(cardId, {
        ldlMgDl: params.ldl.mgDl || convertMmolLToMgDl(params.ldl.mmolL),
        ldlMmolL: params.ldl.mmolL || convertMgDlToMmolL(params.ldl.mgDl),
      })
    }

    if (params.triglyceride) {
      await this.userCardTriglycerideLevelCrudService.addUserTriglycerideLevelByCardId(cardId, {
        triglycerideMgDl: params.triglyceride.mgDl || convertMmolLToMgDl(params.triglyceride.mmolL),
        triglycerideMmolL: params.triglyceride.mmolL || convertMgDlToMmolL(params.triglyceride.mgDl),
      })
    }
  }

  async addMoreQuestionsByCardId(
    userId: string,
    cardId: string,
    params: AssessmentHealthQuestionsParamsDto,
    i18n: I18nContext,
  ): Promise<void> {
    if (params.medications) {
      await this.userMedicationsService.createUserMedicationsByUserId(userId, params.medications, i18n)
    }

    if (params.goalPressureSystolic || params.goalPressureDiastolic) {
      await this.userCardCrudService.updateUserCardById(cardId, {
        goalPressureSystolicMmHg: params.goalPressureSystolic,
        goalPressureDiastolicMmHg: params.goalPressureDiastolic,
      })
    }

    if (params.bloodPressure) {
      await this.userCardBloodPressureCrudService.addUserBloodPressureByCardId(cardId, {
        pressureSystolicMmHg: params.bloodPressure.systolic,
        pressureDiastolicMmHg: params.bloodPressure.diastolic,
        datetime: params.bloodPressure.datetime,
      })
    }

    if (params.noBloodPressureCheck) {
      await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
        noBloodPressureCheck: params.noBloodPressureCheck,
      })
    }
  }

  async addDoctorAppointmentsByParams(
    userId: string,
    cardId: string,
    params: AssessmentHealthAppointmentsParamsDto,
  ): Promise<void> {
    if (params.appointments?.length > 0) {
      await this.userAppointmentsCrudService.addUserAppointmentsByParams(
        params.appointments.map(({ id, ...appointment }) => ({
          userId,
          appointmentId: id,
          ...appointment,
        })),
      )
    }

    if (params.noScheduledAppointment || params.needToScheduleAppointment) {
      await this.userCardProfileCrudService.upsertUserProfileDataByCardId(cardId, {
        noScheduledAppointment: params.noScheduledAppointment || false,
        needToScheduleAppointment: params.needToScheduleAppointment || false,
      })
    }
  }
}
