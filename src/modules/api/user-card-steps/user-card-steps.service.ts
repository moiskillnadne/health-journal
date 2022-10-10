import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { PageDTO } from '../../../core/dtos/pagination'
import { removeNullableProperties } from '../../../core/helpers/object-format'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserCardStepsCrudService } from './user-card-steps.crud'

import { UserCardStepsQueryParamsDto, UserCardStepsBodyParamsDto } from './dto/user-card-steps.dto'
import { GetUserStepsResponseDto, GetUserStepsLastRecordResponseDto } from './dto/user-card-steps.response.dto'

@Injectable()
export class UserCardStepsService {
  constructor(
    private userCardStepsCrudService: UserCardStepsCrudService,
    private userCardCrudService: UserCardCrudService,
  ) {}

  public async getUserStepsByParams(
    id: string,
    params: UserCardStepsQueryParamsDto,
    i18n: I18nContext,
  ): Promise<PageDTO<GetUserStepsResponseDto>> {
    const card = await this.userCardCrudService.getUserCardByUserId(id)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.userCardStepsCrudService.getUserStepsByParams(card.id, params)
  }

  public async getUserStepsLastRecordByUserId(
    id: string,
    i18n: I18nContext,
  ): Promise<GetUserStepsLastRecordResponseDto> {
    const card = await this.userCardCrudService.getUserCardByUserIdWithParams(id, {
      select: {
        id: true,
        goalSteps: true,
      },
    })

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const record = await this.userCardStepsCrudService.getUserStepsRecordByParams(card.id, {
      select: {
        id: true,
        steps: true,
        datetime: true,
      },
      order: {
        datetime: 'desc',
        createAt: 'desc',
      },
    })

    return {
      ...removeNullableProperties({ goalSteps: card.goalSteps }),
      ...record,
    }
  }

  public async addUserStepsByUserId(
    userId: string,
    { goalSteps, ...params }: UserCardStepsBodyParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const card = await this.userCardCrudService.getUserCardByUserId(userId)

    if (!card) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    const steps = await this.userCardStepsCrudService.addUserStepsByParams(card.id, params)

    const goal = await this.userCardCrudService.updateUserCardById(card.id, {
      goalSteps,
    })

    return {
      code: SuccessCodes.StepsSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.StepsWasAdded),
      details: {
        ...steps,
        ...goal,
      },
    }
  }
}
