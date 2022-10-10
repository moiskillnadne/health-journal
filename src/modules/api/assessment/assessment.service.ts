import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { convertCmToFt, convertCmToIn, convertFtToCm, convertInToCm } from '../../../core/measurements/height.converter'
import { convertKgToLb, convertLbToKg } from '../../../core/measurements/weight.converter'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { TargetGroup } from '../../../constants/enums/target-group.constants'

import { IBaseResponse } from '../../../models/response.models'

import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserCrudService } from '../user/user.crud'
import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardWeightCrudService } from '../user-card-weight/user-card-weight.crud'
import { UserTargetGroupsService } from '../user-target-groups/user-target-groups.service'
import { UserTracksService } from '../user-tracks/user-tracks.service'
import { AssessmentHealthService } from './services/assessment-health/assessment-health.service'
import { AssessmentScreeningService } from './services/assessment-screening/assessment-screening.service'
import { AssessmentLifeStyleService } from './services/assessment-lifestyle/assessment-lifestyle.service'

import { AssessmentPersonalInfoParamsDto } from './dto/assessment-personal-info.dto'
import { AssessmentSummaryInfoParamsDto } from './dto/assessment-summary-info.dto'

@Injectable()
export class AssessmentService {
  constructor(
    private userCrudService: UserCrudService,
    private userCardCrudService: UserCardCrudService,
    private userCardWeightCrudService: UserCardWeightCrudService,
    private userTargetGroupsService: UserTargetGroupsService,
    private userTracksService: UserTracksService,
    private assessmentHealthService: AssessmentHealthService,
    private assessmentScreeningService: AssessmentScreeningService,
    private assessmentLifeStyleService: AssessmentLifeStyleService,
  ) {}

  async addAssessmentPersonalInfoByUserId(
    id: string,
    params: AssessmentPersonalInfoParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const heightCm = params.height.cm || Math.ceil(convertFtToCm(params.height.ft) + convertInToCm(params.height.in))
    const heightFt = params.height.ft || Math.floor(convertCmToFt(params.height.cm))
    const heightIn = params.height.in || Math.ceil(convertCmToIn(params.height.cm) - heightFt * 12)

    const [card] = await Promise.all([
      this.userCardCrudService.upsertUserCardByUserId(id, {
        heightCm,
        heightFt,
        heightIn,
        goalWeightKg: params.goalWeight.kg || convertLbToKg(params.goalWeight.lb),
        goalWeightLb: params.goalWeight.lb || convertKgToLb(params.goalWeight.kg),
      }),
      this.userCrudService.updateUserById(id, {
        firstName: params.firstName,
        lastName: params.lastName,
        companyCode: params.companyCode,
        dateOfBirth: params.dateOfBirth,
        city: params.city,
        state: params.state,
        country: params.country,
        genderId: params.genderId,
        raceId: params.raceId,
      }),
    ])

    await this.userCardWeightCrudService.upsertUserWeightByCardId(card.id, {
      weightKg: params.weight.kg || convertLbToKg(params.weight.lb),
      weightLb: params.weight.lb || convertKgToLb(params.weight.kg),
    })

    return {
      code: SuccessCodes.AssessmentPersonalInfoUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  async addAssessmentSummaryInfoByUserId(
    id: string,
    params: AssessmentSummaryInfoParamsDto,
    i18n: I18nContext,
    timezone: string,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (params.conditions) {
      await this.assessmentHealthService.addConditionsByUserId(id, params.conditions)
    }

    if (params.info) {
      await this.assessmentHealthService.addMoreHealthInfoByParams(id, card.id, params.info, i18n)
    }

    if (params.questions) {
      await this.assessmentHealthService.addMoreQuestionsByCardId(id, card.id, params.questions, i18n)
    }

    if (params.appointments) {
      await this.assessmentHealthService.addDoctorAppointmentsByParams(id, card.id, params.appointments)
    }

    if (params.colon) {
      await this.assessmentScreeningService.addColonScreeningByParams(id, card.id, params.colon, timezone)
    }

    if (params.lifestyle) {
      await this.assessmentLifeStyleService.addLifestyleInfoByParams(id, card.id, params.lifestyle)

      if (params.lifestyle.hasDepressionOrAnxiety) {
        await this.userTargetGroupsService.assignTargetGroupByUserId(id, TargetGroup.AnxietyDepression)
      }
    }

    if (params.papSmear) {
      await this.assessmentScreeningService.addPapSmearScreeningByParams(id, card.id, params.papSmear, timezone)
    }

    if (params.mammogram) {
      await this.assessmentScreeningService.addMammogramScreeningByParams(id, card.id, params.mammogram, timezone)
    }

    await this.userTargetGroupsService.assignUserTargetGroupsByGenderAndAge(id)
    await this.userTargetGroupsService.assignUserTargetGroupsByBmi(id)
    await this.userTargetGroupsService.assignUserTargetGroupsByConditions(id)

    await this.userTracksService.assignUserTracksByUserId(id)

    await this.userCrudService.updateUserById(id, {
      isAssessmentPassed: true,
    })

    return {
      code: SuccessCodes.AssessmentSummaryInfoUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }
}
