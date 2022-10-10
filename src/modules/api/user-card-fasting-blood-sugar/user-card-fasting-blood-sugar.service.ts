import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { convertMmolLToMgDl, convertMgDlToMmolL } from '../../../core/measurements/blood-sugar.converter'
import { removeNullableProperties } from '../../../core/helpers/object-format'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardFastingBloodSugarCrudService } from './user-card-fasting-blood-sugar.crud'

import {
  UserCardFastingBloodSugarQueryParamsDto,
  PostUserCardFastingBloodSugarParamsDto,
} from './dto/user-card-fasting-blood-sugar.dto'
import {
  GetUserFastingBloodSugarResponseDto,
  GetUserFastingBloodSugarLastRecordResponseDto,
} from './dto/user-card-fasting-blood-sugar.response.dto'

@Injectable()
export class UserCardFastingBloodSugarService {
  constructor(
    private userCardFastingBloodSugarCrudService: UserCardFastingBloodSugarCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserFastingBloodSugarByParams(
    id: string,
    params: UserCardFastingBloodSugarQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserFastingBloodSugarResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardFastingBloodSugarCrudService.getUserFastingBloodSugarByParams(card.id, params)
  }

  public async getUserFastingBloodSugarLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserFastingBloodSugarLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalFastingBloodSugarMgDl: true,
        goalFastingBloodSugarMmolL: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardFastingBloodSugarCrudService.getUserFastingBloodSugarByCardIdWithParams(card.id, {
      select: {
        datetime: true,
        sugarMgDl: true,
        sugarMmolL: true,
      },
      order: {
        datetime: 'desc',
        createAt: 'desc',
      },
    })

    return {
      ...removeNullableProperties(card),
      ...record,
    }
  }

  public async getUserFastingBloodSugarLastRecordsByUserId(
    id: string,
    take: number,
  ): Promise<GetUserFastingBloodSugarLastRecordResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalFastingBloodSugarMgDl: true,
        goalFastingBloodSugarMmolL: true,
      },
    })

    const records = await this.userCardFastingBloodSugarCrudService.getUserFastingBloodSugarByCardId(card.id, {
      select: {
        datetime: true,
        sugarMgDl: true,
        sugarMmolL: true,
      },
      order: {
        datetime: 'desc',
        createAt: 'desc',
      },
      take,
    })

    return records.map((record) => ({
      ...card,
      ...record,
    }))
  }

  public async addFastingBloodSugar(
    userId: string,
    params: PostUserCardFastingBloodSugarParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const fastingBloodSugarResult = await this.userCardFastingBloodSugarCrudService.addUserFastingBloodSugarByCardId(
      card.id,
      {
        sugarMgDl: params.fastingBloodSugar?.mgDl || convertMmolLToMgDl(params.fastingBloodSugar?.mmolL),
        sugarMmolL: params.fastingBloodSugar?.mmolL || convertMgDlToMmolL(params.fastingBloodSugar?.mgDl),
        datetime: params.fastingBloodSugar.datetime,
      },
    )

    const userCardGoalFastingBloodSugarResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalFastingBloodSugarMgDl:
        params.goalFastingBloodSugar?.mgDl ||
        (params.goalFastingBloodSugar?.mmolL && convertMmolLToMgDl(params.goalFastingBloodSugar.mmolL)),
      goalFastingBloodSugarMmolL:
        params.goalFastingBloodSugar?.mmolL ||
        (params.goalFastingBloodSugar?.mgDl && convertMgDlToMmolL(params.goalFastingBloodSugar.mgDl)),
    })

    return {
      code: SuccessCodes.BloodSugarSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.BloodSugarWasAdded),
      details: {
        ...fastingBloodSugarResult,
        ...userCardGoalFastingBloodSugarResult,
      },
    }
  }
}
