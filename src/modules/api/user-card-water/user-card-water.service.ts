import { convertMLtoFLOZ, convertFLOZtoML } from './../../../core/measurements/water.converter'
import { removeNullableProperties } from './../../../core/helpers/object-format'
import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'
import { UserCardWaterCrudService } from './user-card-water.crud'
import { PostUserCardWaterParamsDTO } from './dto/user-card-water.dto'
import { UserCardCrudService } from '../user-card/user-card.crud'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { GetUserCardWaterHistoryLatestRecordResponseDTO } from './dto/user-card-water-response.dto'

@Injectable()
export class UserCardWaterService {
  constructor(
    private userCardWaterCrudService: UserCardWaterCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getLatestWaterRecord(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserCardWaterHistoryLatestRecordResponseDTO> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(userId, {
      select: {
        id: true,
        goalWaterFloz: true,
        goalWaterMl: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const [groupWaterHistoryByToday] = await this.userCardWaterCrudService.getTodaysWaterRecordsById(card.id)

    return {
      ...removeNullableProperties(card),
      ...groupWaterHistoryByToday,
    }
  }

  public async saveWaterRecord(
    userId: string,
    i18n: I18nContext,
    params: PostUserCardWaterParamsDTO,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(userId, {
      select: {
        id: true,
        goalWaterFloz: true,
        goalWaterMl: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const userCardWaterResult = await this.userCardCrudService.upsertUserCardByUserId(userId, {
      goalWaterFloz: params.goalWater.floz || convertMLtoFLOZ(params.goalWater.ml),
      goalWaterMl: params.goalWater.ml || convertFLOZtoML(params.goalWater.floz),
    })

    const userCardHistoryResult = await this.userCardWaterCrudService.insertWaterValue(card.id, {
      waterFloz: params.water.floz || convertMLtoFLOZ(params.water.ml),
      waterMl: params.water.ml || convertFLOZtoML(params.water.floz),
    })

    return {
      httpCode: HttpStatus.CREATED,
      code: SuccessCodes.WaterRecordSaved,
      message: i18n.t(DictionaryPathToken.WaterSaved),
      details: {
        ...userCardHistoryResult,
        ...userCardWaterResult,
      },
    }
  }
}
