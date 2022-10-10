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
import { UserCardRandomBloodSugarCrudService } from './user-card-random-blood-sugar.crud'

import {
  UserCardRandomBloodSugarQueryParamsDto,
  RandomBloodSugarWithGoalParamsDto,
} from './dto/user-card-random-blood-sugar.dto'
import {
  GetUserRandomBloodSugarResponseDto,
  GetUserRandomBloodSugarLastRecordResponseDto,
} from './dto/user-card-random-blood-sugar.response.dto'

@Injectable()
export class UserCardRandomBloodSugarService {
  constructor(
    private userCardRandomBloodSugarCrudService: UserCardRandomBloodSugarCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserRandomBloodSugarByParams(
    id: string,
    params: UserCardRandomBloodSugarQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserRandomBloodSugarResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardRandomBloodSugarCrudService.getUserRandomBloodSugarByParams(card.id, params)
  }

  public async getUserRandomBloodSugarLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserRandomBloodSugarLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalRandomBloodSugarMgDl: true,
        goalRandomBloodSugarMmolL: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardRandomBloodSugarCrudService.getUserRandomBloodSugarByCardIdWithParams(card.id, {
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

  public async getUserRandomBloodSugarLastRecordsByUserId(
    id: string,
    take: number,
  ): Promise<GetUserRandomBloodSugarLastRecordResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalRandomBloodSugarMgDl: true,
        goalRandomBloodSugarMmolL: true,
      },
    })

    const records = await this.userCardRandomBloodSugarCrudService.getUserRandomBloodSugarByCardId(card.id, {
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

  public async addRandomBloodSugarRecord(
    userId: string,
    params: RandomBloodSugarWithGoalParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const randomBloodSugarResult = await this.userCardRandomBloodSugarCrudService.addUserRandomBloodSugarByCardId(
      card.id,
      {
        sugarMgDl: params.randomBloodSugar.mgDl || convertMmolLToMgDl(params.randomBloodSugar.mmolL),
        sugarMmolL: params.randomBloodSugar.mmolL || convertMgDlToMmolL(params.randomBloodSugar.mgDl),
        datetime: params.randomBloodSugar.datetime,
      },
    )

    const goalRandomBloodSugarResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalRandomBloodSugarMgDl:
        params.goalRandomBloodSugar?.mgDl ||
        (params.goalRandomBloodSugar?.mmolL && convertMmolLToMgDl(params.goalRandomBloodSugar.mmolL)),
      goalRandomBloodSugarMmolL:
        params.goalRandomBloodSugar?.mmolL ||
        (params.goalRandomBloodSugar?.mgDl && convertMgDlToMmolL(params.goalRandomBloodSugar.mgDl)),
    })

    return {
      code: SuccessCodes.BloodSugarSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.BloodSugarWasAdded),
      details: {
        ...randomBloodSugarResult,
        ...goalRandomBloodSugarResult,
      },
    }
  }
}
