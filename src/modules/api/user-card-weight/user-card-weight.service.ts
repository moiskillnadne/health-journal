import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { convertLbToKg, convertKgToLb } from '../../../core/measurements/weight.converter'
import { removeNullableProperties } from '../../../core/helpers/object-format'

import { BadRequestError } from '../../../core/errors/bad-request.error'

import { IBaseResponse } from '../../../models/response.models'
import { UserCardWeightCrudService } from './user-card-weight.crud'
import { UserCardCrudService } from '../user-card/user-card.crud'

import {
  GetUserWeightHistoryResponseDto,
  GetUserWeightLastRecordResponseDto,
} from './dto/user-card-weight.response.dto'
import { PostUserCardWeightParamsDto, UserCardWeightHistoryQueryParamsDto } from './dto/user-card-weight.dto'

@Injectable()
export class UserCardWeightService {
  constructor(
    private userCardWeightCrudService: UserCardWeightCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserWeightHistoryByParams(
    id: string,
    params: UserCardWeightHistoryQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserWeightHistoryResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardWeightCrudService.getUserWeightHistoryByParams(card.id, params)
  }

  public async getUserWeightLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserWeightLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardWeightCrudService.getUserWeightRecordByCardIdWithParams(card.id, {
      select: {
        id: true,
        weightKg: true,
        weightLb: true,
        datetime: true,
      },
      order: {
        datetime: 'desc',
        createAt: 'desc',
      },
    })

    return {
      ...removeNullableProperties({ goalWeightKg: Number(card.goalWeightKg), goalWeightLb: Number(card.goalWeightLb) }),
      ...removeNullableProperties({
        id: record.id,
        weightKg: Number(record.weightKg),
        weightLb: Number(record.weightLb),
        datetime: record.datetime,
      }),
    }
  }

  public async addWeightToUserHistory(
    userId: string,
    params: PostUserCardWeightParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const weightResult = await this.userCardWeightCrudService.addUserWeightByCardId(card.id, {
      weightKg: params.weight.kg || convertLbToKg(params.weight.lb),
      weightLb: params.weight.lb || convertKgToLb(params.weight.kg),
      datetime: params.weight.datetime,
    })

    const goalWeightResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalWeightKg: params.goalWeight.kg || convertLbToKg(params.goalWeight.lb),
      goalWeightLb: params.goalWeight.lb || convertKgToLb(params.goalWeight.kg),
    })

    return {
      code: SuccessCodes.WeightSaved,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.WeightWasAdded),
      details: { ...weightResult, ...goalWeightResult },
    }
  }
}
