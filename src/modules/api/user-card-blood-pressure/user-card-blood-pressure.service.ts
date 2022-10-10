import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { removeNullableProperties } from '../../../core/helpers/object-format'
import { IBaseResponse } from '../../../models/response.models'

import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardBloodPressureCrudService } from './user-card-blood-pressure.crud'

import {
  UserCardBloodPressureQueryParamsDto,
  UserCardBloodPressureSaveBodyParamsDTO,
} from './dto/user-card-blood-pressure.dto'
import {
  GetUserBloodPressureResponseDto,
  GetUserBloodPressureLastRecordResponseDto,
} from './dto/user-card-blood-pressure.response.dto'

@Injectable()
export class UserCardBloodPressureService {
  constructor(
    private userCardBloodPressureCrudService: UserCardBloodPressureCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserBloodPressureByParams(
    id: string,
    params: UserCardBloodPressureQueryParamsDto,
    i18n: I18nContext,
  ): Promise<GetUserBloodPressureResponseDto[]> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardBloodPressureCrudService.getUserBloodPressureByParams(card.id, params)
  }

  public async getUserBloodPressureLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserBloodPressureLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalPressureSystolicMmHg: true,
        goalPressureDiastolicMmHg: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardBloodPressureCrudService.getUserBloodPressureByCardIdWithParams(card.id, {
      select: {
        datetime: true,
        pressureSystolicMmHg: true,
        pressureDiastolicMmHg: true,
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

  public async addBloodPressure(
    userId: string,
    params: UserCardBloodPressureSaveBodyParamsDTO,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.findOrCreateUserCard(userId)

    const bloodPressureResult = await this.userCardBloodPressureCrudService.addUserBloodPressureByCardId(card.id, {
      pressureSystolicMmHg: params.systolic,
      pressureDiastolicMmHg: params.diastolic,
      datetime: params.datetime,
    })

    const goalBloodPressureResult = await this.userCardCrudService.updateUserCardById(card.id, {
      goalPressureSystolicMmHg: params.goalPressureSystolic,
      goalPressureDiastolicMmHg: params.goalPressureDiastolic,
    })

    return {
      code: SuccessCodes.BloodPressureSaved,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.BloodPressureWasAdded),
      details: {
        ...bloodPressureResult,
        ...goalBloodPressureResult,
      },
    }
  }
}
