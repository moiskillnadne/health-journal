import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import {
  defaultHba1cBottomThreshold,
  defaultHba1cTopThreshold,
  defaultHba1cStep,
} from '../../../constants/enums/hba1c.constants'
import { removeNullableProperties } from '../../../core/helpers/object-format'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { OptionsResponseDto } from '../../../core/dtos/response/options.dto'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardHba1cCrudService } from './user-card-hba1c.crud'

import { UserCardHba1cQueryParamsDto, PostUserCardHba1cHistoryParamsDto } from './dto/user-card-hba1c.dto'
import { GetUserHba1cResponseDto, GetUserHba1cLastRecordResponseDto } from './dto/user-card-hba1c.response.dto'

@Injectable()
export class UserCardHba1cService {
  constructor(
    private userCardHba1cCrudService: UserCardHba1cCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserHba1cByParams(
    id: string,
    params: UserCardHba1cQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserHba1cResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardHba1cCrudService.getUserHba1cByParams(card.id, params)
  }

  public async getUserHba1cLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserHba1cLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalHba1c: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const hba1c = await this.userCardHba1cCrudService.getUserHba1cByCardIdWithParams(card.id, {
      select: {
        id: true,
        datetime: true,
        percent: true,
      },
      order: {
        datetime: 'desc',
        createAt: 'desc',
      },
    })

    return {
      ...removeNullableProperties({ goalHba1c: card.goalHba1c }),
      ...removeNullableProperties(hba1c ? { id: hba1c.id, hba1c: hba1c.percent, datetime: hba1c.datetime } : {}),
    }
  }

  public getHba1cList(): OptionsResponseDto[] {
    const list = []

    for (let i = defaultHba1cBottomThreshold; i <= defaultHba1cTopThreshold; i += defaultHba1cStep) {
      const number = i.toFixed(1)

      if (Number(number) === defaultHba1cBottomThreshold)
        list.push({ value: Number(number), label: `${number} or less` })
      else if (Number(number) === defaultHba1cTopThreshold)
        list.push({ value: Number(number), label: `${number} or above` })
      else list.push({ value: Number(number), label: `${number}` })
    }

    return list
  }

  public async addHba1cRecord(
    userId: string,
    params: PostUserCardHba1cHistoryParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const hba1cSaveResult = await this.userCardHba1cCrudService.addUserHba1cByCardId(card.id, {
      percent: params.hba1c.percent,
      datetime: params.hba1c.datetime,
    })

    const goalHba1cSaveResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalHba1c: params.goalHba1c,
    })

    return {
      code: SuccessCodes.Hba1cSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.Hba1cWasAdded),
      details: {
        ...hba1cSaveResult,
        ...goalHba1cSaveResult,
      },
    }
  }
}
