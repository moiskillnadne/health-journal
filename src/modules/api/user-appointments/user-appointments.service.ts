import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { BadRequestErrorResponse } from '../../../core/dtos/response/bad-request-error.dto'

import { UserAppointmentsCrudService } from './user-appointments.crud'

import { UserAppointmentsOptionalParamsDto } from './dto/user-appointments.dto'
import { GetUserAppointmentResponseDto, GetUserAppointmentEntityDto } from './dto/user-appointments.response.dto'
import { UserAppointmentsEntity } from '../../../database/entities/user-appointments.entity'
import { FindOptionsWhere } from 'typeorm'

@Injectable()
export class UserAppointmentsService {
  constructor(private userAppointmentsCrudService: UserAppointmentsCrudService) {}

  public async getUserAppointmentById(
    uuid: string,
    i18n: I18nContext,
  ): Promise<GetUserAppointmentEntityDto | BadRequestErrorResponse> {
    const appointment = await this.userAppointmentsCrudService.getUserAppointmentById(uuid)

    if (!appointment) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.AppointmentNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    return appointment
  }

  public async getUserAppointmentsByUserId(
    userId: string,
    where: FindOptionsWhere<UserAppointmentsEntity> = {},
  ): Promise<GetUserAppointmentResponseDto[]> {
    const appointments = await this.userAppointmentsCrudService.getUserAppointmentsByParams({ userId, ...where })

    return appointments.map(({ id, appointment, ...info }) => ({
      appointmentId: id,
      name: appointment.name,
      description: appointment.description,
      ...info,
    }))
  }

  public async createUserAppointmentsByUserId(
    userId: string,
    params: UserAppointmentsOptionalParamsDto[],
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse> {
    await this.userAppointmentsCrudService.addUserAppointmentsByParams(
      params.map(({ id, ...appointment }) => ({
        userId,
        appointmentId: id,
        ...appointment,
      })),
    )

    return {
      code: SuccessCodes.UserAppointmentCreated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.CreatedSuccessfully),
    }
  }

  public async updateUserAppointmentById(
    uuid: string,
    { id, ...params }: UserAppointmentsOptionalParamsDto,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    const appointment = await this.userAppointmentsCrudService.getUserAppointmentById(uuid)

    if (!appointment) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.AppointmentNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.userAppointmentsCrudService.updateUserAppointmentById(uuid, {
      ...(id ? { appointmentId: id } : {}),
      ...params,
    })

    return {
      code: SuccessCodes.UserAppointmentUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async deleteUserAppointmentById(
    uuid: string,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    const appointment = await this.userAppointmentsCrudService.getUserAppointmentById(uuid)

    if (!appointment) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.AppointmentNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.userAppointmentsCrudService.deleteUserAppointmentById(uuid)

    return {
      code: SuccessCodes.UserAppointmentDeleted,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.DeletedSuccessfully),
    }
  }
}
