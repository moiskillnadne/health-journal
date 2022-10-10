import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { removeNullableProperties } from '../../../core/helpers/object-format'

import * as arrayUtils from '../../../core/helpers/array-format'
import * as objectUtils from '../../../core/helpers/object-format'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { BadRequestErrorResponse } from '../../../core/dtos/response/bad-request-error.dto'
import { OptionsResponseDto } from '../../../core/dtos/response/options.dto'

import { toPeriodicNumbersArray } from '../../../core/helpers/number-format'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import {
  defaultProceduresFrequency,
  Procedure,
  ProcedureRemindOptions,
} from '../../../constants/enums/procedures.constants'
import {
  RecurrencePeriodsToFiveYearsInMonth,
  RecurrencePeriodsToTenYearsInMonth,
  RecurrencePeriodsToThreeYearsInMonth,
} from '../../../constants/enums/period.constants'

import { UserRemindersService } from '../user-reminders/user-reminders.service'

import { UserProceduresCrudService } from './user-procedures.crud'

import { UserProceduresBodyParamsDto } from './dto/user-procedures.dto'
import { GetUserProcedureEntityDto, GetUserProcedureResponseDto } from './dto/user-procedures.response.dto'
import { utcToZonedTime } from 'date-fns-tz'

@Injectable()
export class UserProceduresService {
  constructor(
    private userProceduresCrudService: UserProceduresCrudService,
    private userRemindersService: UserRemindersService,
  ) {}

  public getUserProcedureFrequency(): OptionsResponseDto[] {
    return arrayUtils.toValueLabelFormat(toPeriodicNumbersArray(defaultProceduresFrequency))
  }

  public getUserProcedurePeriods(): OptionsResponseDto[] {
    return objectUtils.toValueLabelFormat(ProcedureRemindOptions)
  }

  public async getUserProcedureById(
    uuid: string,
    i18n: I18nContext,
  ): Promise<GetUserProcedureEntityDto | BadRequestErrorResponse> {
    const procedure = await this.userProceduresCrudService.getUserProcedureById(uuid)

    if (!procedure) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.ProcedureNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    return {
      id: procedure.id,
      procedureId: procedure.procedureId,
      name: procedure.name,
      datetime: procedure.datetime,
      interval: procedure.reminder?.interval,
      period: procedure.reminder?.period,
    }
  }

  public async getUserProceduresByUserId(userId: string): Promise<GetUserProcedureResponseDto[]> {
    const procedures = await this.userProceduresCrudService.getUserProceduresByParams({ userId })

    return procedures.map((procedure) => ({
      procedureId: procedure.id,
      name: procedure.procedure?.name,
      otherEventName: procedure.name,
      description: procedure.procedure?.description,
      datetime: procedure.datetime,
    }))
  }

  public async createUserProcedureByUserId(
    userId: string,
    params: UserProceduresBodyParamsDto,
    i18n: I18nContext,
    timezone?: string,
  ): Promise<BaseSuccessResponse> {
    let reminder

    if (params.period && params.interval) {
      reminder = await this.userRemindersService.addUserReminderByProcedureId(params.id, {
        userId,
        interval: params.interval,
        period: params.period,
      })
    }

    await this.userProceduresCrudService.addUserProcedureByParams({
      userId,
      procedureId: params.id,
      name: params.name,
      datetime: params.datetime,
      date: utcToZonedTime(params.datetime, timezone),
      ...(reminder?.id ? { reminderId: reminder?.id } : {}),
    })

    return {
      code: SuccessCodes.UserProcedureCreated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.CreatedSuccessfully),
    }
  }

  public async updateUserProcedureById(
    uuid: string,
    params: UserProceduresBodyParamsDto,
    i18n: I18nContext,
    timezone?: string,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    let reminder
    const procedure = await this.userProceduresCrudService.getUserProcedureById(uuid)

    if (!procedure) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.ProcedureNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!procedure.reminderId && params.period && params.interval) {
      reminder = await this.userRemindersService.addUserReminderByProcedureId(procedure.procedureId, {
        userId: procedure.userId,
        interval: params.interval,
        period: params.period,
      })
    }

    if (procedure.reminderId) {
      if (!params.period && !params.interval) {
        await this.userRemindersService.deleteUserReminderById(procedure.reminderId)
      }

      if (params.period || params.interval) {
        await this.userRemindersService.updateUserReminderById(
          procedure.reminderId,
          removeNullableProperties({
            period: params.period,
            interval: params.interval,
          }),
        )
      }
    }

    await this.userProceduresCrudService.updateUserProcedureById(
      uuid,
      removeNullableProperties({
        procedureId: params.id,
        name: params.name,
        datetime: params.datetime,
        date: utcToZonedTime(params.datetime, timezone),
        reminderId: reminder?.id,
      }),
    )

    return {
      code: SuccessCodes.UserProcedureUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async deleteUserProcedureById(
    uuid: string,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    const procedure = await this.userProceduresCrudService.getUserProcedureById(uuid)

    if (!procedure) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.ProcedureNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.userProceduresCrudService.deleteUserProcedureById(procedure.id)

    if (procedure.reminderId) {
      await this.userRemindersService.deleteUserReminderById(procedure.reminderId)
    }

    return {
      code: SuccessCodes.UserProcedureDeleted,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.DeletedSuccessfully),
    }
  }

  public getUserProcedureRecurrencePeriods(procedure): OptionsResponseDto[] {
    switch (procedure) {
      case Procedure.PapSmear:
        return objectUtils.toValueLabelFormat(RecurrencePeriodsToFiveYearsInMonth)
      case Procedure.Mammogram:
        return objectUtils.toValueLabelFormat(RecurrencePeriodsToThreeYearsInMonth)
      case Procedure.Colonoscopy:
        return objectUtils.toValueLabelFormat(RecurrencePeriodsToTenYearsInMonth)
      default:
        return objectUtils.toValueLabelFormat(RecurrencePeriodsToTenYearsInMonth)
    }
  }
}
