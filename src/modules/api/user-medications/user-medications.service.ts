import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { BadRequestErrorResponse } from '../../../core/dtos/response/bad-request-error.dto'
import { OptionsResponseDto } from '../../../core/dtos/response/options.dto'

import { toPeriodicNumbersArray } from '../../../core/helpers/number-format'
import * as arrayUtils from '../../../core/helpers/array-format'
import * as objectUtils from '../../../core/helpers/object-format'

import { UserMedicationsCrudService } from './user-medications.crud'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { Period } from '../../../constants/enums/period.constants'
import { CurrencyOptions } from '../../../constants/enums/currency.constants'

import { BadRequestError } from '../../../core/errors/bad-request.error'

import { getMedicationDose } from './user-medications.helper'

import { UserMedicationsOptionalParamsDto, UserMedicationsQueryParamsDto } from './dto/user-medications.dto'
import { GetUserMedicationResponseDto } from './dto/user-medications.response.dto'
import { defaultMedicationsFrequency } from '../../../constants/enums/medications.constants'

@Injectable()
export class UserMedicationsService {
  constructor(private userMedicationsCrudService: UserMedicationsCrudService) {}

  public getUserMedicationFrequency(): OptionsResponseDto[] {
    return arrayUtils.toValueLabelFormat(toPeriodicNumbersArray(defaultMedicationsFrequency))
  }

  public getUserMedicationPeriods(): OptionsResponseDto[] {
    return arrayUtils.toValueLabelFormat(Object.values(Period))
  }

  public getUserMedicationCurrency(): OptionsResponseDto[] {
    return objectUtils.toValueLabelFormat(CurrencyOptions)
  }

  public async getUserMedicationById(uuid: string, i18n: I18nContext): Promise<GetUserMedicationResponseDto> {
    const [item] = await this.userMedicationsCrudService.getUserMedicationsByParams({ id: uuid })

    if (!item) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.MedicationNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    const { medication, ...info } = item

    return {
      name: medication.name,
      dose: getMedicationDose(medication),
      ...info,
    }
  }

  public async getUserMedicationsByUserId(
    userId: string,
    params: UserMedicationsQueryParamsDto,
  ): Promise<GetUserMedicationResponseDto[]> {
    const medications = await this.userMedicationsCrudService.getUserMedicationsByParams({ userId, ...params })

    return medications.map(({ medication, ...info }) => {
      return {
        name: medication.name,
        dose: getMedicationDose(medication),
        ...info,
      }
    })
  }

  public async createUserMedicationsByUserId(
    userId: string,
    params: UserMedicationsOptionalParamsDto[],
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse> {
    await this.userMedicationsCrudService.addUserMedicationsByParams(
      params.map(({ id, ...medication }) => ({
        userId,
        medicationProductId: id,
        ...medication,
      })),
    )

    return {
      code: SuccessCodes.UserMedicationCreated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.CreatedSuccessfully),
    }
  }

  public async updateUserMedicationById(
    uuid: string,
    { id, status, ...params }: UserMedicationsOptionalParamsDto,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    const medication = await this.userMedicationsCrudService.getUserMedicationById(uuid)

    if (!medication) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.MedicationNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.userMedicationsCrudService.updateUserMedicationById(uuid, {
      ...(id ? { medicationProductId: id } : {}),
      ...(status && status !== medication.status ? { status, statusUpdated: new Date() } : {}),
      ...params,
    })

    return {
      code: SuccessCodes.UserMedicationUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async deleteUserMedicationById(
    uuid: string,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    const medication = await this.userMedicationsCrudService.getUserMedicationById(uuid)

    if (!medication) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.MedicationNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.userMedicationsCrudService.deleteUserMedicationById(uuid)

    return {
      code: SuccessCodes.UserMedicationDeleted,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.DeletedSuccessfully),
    }
  }
}
