import { I18nContext } from 'nestjs-i18n'
import { BadRequestError } from './../../../core/errors/bad-request.error'
import { HttpStatus, Injectable } from '@nestjs/common'
import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardSleepCrudService } from './user-card-sleep.crud'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { removeNullableProperties } from '../../../core/helpers/object-format'
import { GetUserCardSleepHistoryLastRecordResponseDto } from './dto/user-card-sleep-response.dto'
import { UserCardSleepBodyParamsDto } from './dto/user-card-sleep.dto'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'

@Injectable()
export class UserCardSleepService {
  constructor(
    private userCardSleepHistoryCrudService: UserCardSleepCrudService,
    private userCardService: UserCardCrudService,
  ) {}

  public async getLatestSleepHistoryRecord(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserCardSleepHistoryLastRecordResponseDto> {
    const card = await this.userCardService.getUserCardByUserIdWithParams(userId, {
      select: {
        id: true,
        sleepGoal: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const sleep = await this.userCardSleepHistoryCrudService.getOneRecordByIdWithParams(card.id, {
      select: {
        id: true,
        datetime: true,
        sleepHours: true,
      },
      order: {
        datetime: 'DESC',
        createAt: 'DESC',
      },
    })

    return {
      ...removeNullableProperties({ sleepGoal: Number(card.sleepGoal) }),
      ...removeNullableProperties(
        sleep
          ? {
              id: sleep.id,
              datetime: sleep.datetime,
              sleepHours: Number(sleep.sleepHours),
            }
          : {},
      ),
    }
  }

  public async saveSleepRecord(
    userId: string,
    i18n: I18nContext,
    params: UserCardSleepBodyParamsDto,
  ): Promise<IBaseResponse> {
    const card = await this.userCardService.getUserCardByUserId(userId)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const userCardSleepResult = await this.userCardService.updateUserCardById(card.id, { sleepGoal: params.sleepGoal })

    const userCardSleepHistoryResult = await this.userCardSleepHistoryCrudService.saveRecord(card.id, {
      datetime: params.datetime,
      sleepHours: params.sleepHours,
    })

    return {
      code: SuccessCodes.SleepRecordCreated,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.SleepAdded),
      details: {
        ...userCardSleepResult,
        ...userCardSleepHistoryResult,
      },
    }
  }
}
