import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { removeNullableProperties } from '../../../core/helpers/object-format'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardTriglycerideLevelCrudService } from './user-card-triglyceride-level.crud'

import {
  GetUserTriglycerideLevelLastRecordResponseDto,
  GetUserTriglycerideResponseDto,
} from './dto/user-card-triglyceride-level.response.dto'
import {
  PostUserCardTriglycerideLevelParamsDto,
  UserCardTriglycerideLevelPeriodParamsDto,
} from './dto/user-card-triglyceride-level.dto'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { convertMmolLToMgDl, convertMgDlToMmolL } from '../../../core/measurements/blood-sugar.converter'

@Injectable()
export class UserCardTriglycerideLevelService {
  constructor(
    private userCardTriglycerideLevelCrudService: UserCardTriglycerideLevelCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserCardTriglycerideLevel(
    userId: string,
    params: UserCardTriglycerideLevelPeriodParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserTriglycerideResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(userId)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardTriglycerideLevelCrudService.getUserCardTriglycerideLevelByParams(card.id, params)
  }

  public async getUserTriglycerideLevelLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserTriglycerideLevelLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalTriglycerideMgDl: true,
        goalTriglycerideMmolL: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardTriglycerideLevelCrudService.getUserTriglycerideLevelByCardIdWithParams(card.id, {
      select: {
        datetime: true,
        triglycerideMgDl: true,
        triglycerideMmolL: true,
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

  public async addTriglycerideLevel(
    userId: string,
    params: PostUserCardTriglycerideLevelParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    let goal

    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    if (params.goalTriglyceride?.mgDl || params.goalTriglyceride?.mmolL) {
      goal = await this.userCardCrudService.updateUserCardById(card.id, {
        goalTriglycerideMgDl: params.goalTriglyceride.mgDl || convertMmolLToMgDl(params.goalTriglyceride.mmolL),
        goalTriglycerideMmolL: params.goalTriglyceride.mmolL || convertMgDlToMmolL(params.goalTriglyceride.mgDl),
      })
    }

    const triglyceride = await this.userCardTriglycerideLevelCrudService.addUserTriglycerideLevelByCardId(card.id, {
      triglycerideMgDl: params.triglyceride.mgDl || convertMmolLToMgDl(params.triglyceride.mmolL),
      triglycerideMmolL: params.triglyceride.mmolL || convertMgDlToMmolL(params.triglyceride.mgDl),
      datetime: params.triglyceride.datetime,
    })

    return {
      code: SuccessCodes.TriglyceridesSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.TriglycerideWasAdded),
      details: {
        ...goal,
        ...triglyceride,
      },
    }
  }
}
