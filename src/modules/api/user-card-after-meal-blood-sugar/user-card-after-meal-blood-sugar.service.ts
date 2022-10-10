import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { IBaseResponse } from '../../../models/response.models'

import { convertMmolLToMgDl, convertMgDlToMmolL } from '../../../core/measurements/blood-sugar.converter'
import { removeNullableProperties } from '../../../core/helpers/object-format'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardAfterMealBloodSugarCrudService } from './user-card-after-meal-blood-sugar.crud'

import {
  UserCardAfterMealBloodSugarQueryParamsDto,
  PostUserCardAfterMealBloodSugarParamsDto,
} from './dto/user-card-after-meal-blood-sugar.dto'
import {
  GetUserAfterMealBloodSugarResponseDto,
  GetUserAfterMealBloodSugarLastRecordResponseDto,
} from './dto/user-card-after-meal-blood-sugar.response.dto'

@Injectable()
export class UserCardAfterMealBloodSugarService {
  constructor(
    private userCardAfterMealBloodSugarCrudService: UserCardAfterMealBloodSugarCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserAfterMealBloodSugarByParams(
    id: string,
    params: UserCardAfterMealBloodSugarQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserAfterMealBloodSugarResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardAfterMealBloodSugarCrudService.getUserAfterMealBloodSugarByParams(card.id, params)
  }

  public async getUserAfterMealBloodSugarLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserAfterMealBloodSugarLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalAfterMealBloodSugarMgDl: true,
        goalAfterMealBloodSugarMmolL: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardAfterMealBloodSugarCrudService.getUserAfterMealBloodSugarByCardIdWithParams(
      card.id,
      {
        select: {
          datetime: true,
          sugarMgDl: true,
          sugarMmolL: true,
        },
        order: {
          datetime: 'desc',
          createAt: 'desc',
        },
      },
    )

    return {
      ...removeNullableProperties(card),
      ...record,
    }
  }

  public async getUserAfterMealBloodSugarLastRecordsByUserId(
    id: string,
    take: number,
  ): Promise<GetUserAfterMealBloodSugarLastRecordResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalAfterMealBloodSugarMgDl: true,
        goalAfterMealBloodSugarMmolL: true,
      },
    })

    const records = await this.userCardAfterMealBloodSugarCrudService.getUserAfterMealBloodSugarByCardId(card.id, {
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

  public async addAfterMealBloodSugarRecord(
    userId: string,
    params: PostUserCardAfterMealBloodSugarParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const userCardGoalAfterMealBloodSugarResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalAfterMealBloodSugarMgDl:
        params.goalAfterMealBloodSugar?.mgDl ||
        (params.goalAfterMealBloodSugar?.mmolL && convertMmolLToMgDl(params.goalAfterMealBloodSugar.mmolL)),
      goalAfterMealBloodSugarMmolL:
        params.goalAfterMealBloodSugar?.mmolL ||
        (params.goalAfterMealBloodSugar?.mgDl && convertMgDlToMmolL(params.goalAfterMealBloodSugar.mgDl)),
    })

    const afterMealBloodSugar = await this.userCardAfterMealBloodSugarCrudService.addUserAfterMealBloodSugarByCardId(
      card.id,
      {
        sugarMgDl: params.afterMealBloodSugar.mgDl || convertMmolLToMgDl(params.afterMealBloodSugar.mmolL),
        sugarMmolL: params.afterMealBloodSugar.mmolL || convertMgDlToMmolL(params.afterMealBloodSugar.mgDl),
        datetime: params.afterMealBloodSugar.datetime,
      },
    )

    return {
      code: SuccessCodes.BloodSugarSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.BloodSugarWasAdded),
      details: {
        ...afterMealBloodSugar,
        ...userCardGoalAfterMealBloodSugarResult,
      },
    }
  }
}
