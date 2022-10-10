import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { removeNullableProperties } from '../../../core/helpers/object-format'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardLdlLevelCrudService } from './user-card-ldl-level.crud'

import {
  GetUserLdlLevelLastRecordResponseDto,
  GetUserLdlLevelResponseDto,
} from './dto/user-card-ldl-level.response.dto'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { convertMmolLToMgDl, convertMgDlToMmolL } from '../../../core/measurements/blood-sugar.converter'
import { IBaseResponse } from '../../../models/response.models'
import { PostUserCardLdlLevelParamsDto, UserCardLdlLevelQueryParamsDto } from './dto/user-card-ldl-level.dto'

@Injectable()
export class UserCardLdlLevelService {
  constructor(
    private userCardLdlLevelCrudService: UserCardLdlLevelCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserLdlLevel(
    userId: string,
    params: UserCardLdlLevelQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserLdlLevelResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(userId)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardLdlLevelCrudService.getLdlLevelByParams(card.id, params)
  }

  public async getUserLdlLevelLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserLdlLevelLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalLdlMgDl: true,
        goalLdlMmolL: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardLdlLevelCrudService.getUserLdlLevelByCardIdWithParams(card.id, {
      select: {
        datetime: true,
        ldlMgDl: true,
        ldlMmolL: true,
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

  public async addLdlLevel(
    userId: string,
    params: PostUserCardLdlLevelParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const userCardLdlResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalLdlMgDl: params.goalLdl?.mgDl || (params.goalLdl?.mmolL && convertMmolLToMgDl(params.goalLdl.mmolL)),
      goalLdlMmolL: params.goalLdl?.mmolL || (params.goalLdl?.mgDl && convertMgDlToMmolL(params.goalLdl.mgDl)),
    })

    const ldlHistoryResult = await this.userCardLdlLevelCrudService.addUserLdlLevelByCardId(card.id, {
      ldlMgDl: params.ldl.mgDl || convertMmolLToMgDl(params.ldl.mmolL),
      ldlMmolL: params.ldl.mmolL || convertMgDlToMmolL(params.ldl.mgDl),
      datetime: params.ldl.datetime,
    })

    return {
      code: SuccessCodes.LdlSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.LdlWasAdded),
      details: {
        ...userCardLdlResult,
        ...ldlHistoryResult,
      },
    }
  }
}
