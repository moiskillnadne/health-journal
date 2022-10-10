import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, ParseArrayPipe, Get, Post, Req, Param, Patch, Delete } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

import { UserAppointmentsService } from './user-appointments.service'

import { UserAppointmentsOptionalParamsDto } from './dto/user-appointments.dto'
import { GetUserAppointmentEntityDto, GetUserAppointmentResponseDto } from './dto/user-appointments.response.dto'

@ApiTags('User Appointments')
@Controller('user/appointments')
export class UserAppointmentsController {
  constructor(private userAppointmentsService: UserAppointmentsService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserAppointmentResponseDto, isArray: true })
  getUserAppointmentsByUserId(@Req() { user }) {
    return this.userAppointmentsService.getUserAppointmentsByUserId(user.id)
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GetUserAppointmentEntityDto })
  getUserAppointmentById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userAppointmentsService.getUserAppointmentById(id, i18n)
  }

  @Post()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  createUserAppointmentsByUserId(
    @Req() { user },
    @Body(new ParseArrayPipe({ items: UserAppointmentsOptionalParamsDto }))
    appointments: UserAppointmentsOptionalParamsDto[],
    @I18n() i18n: I18nContext,
  ) {
    return this.userAppointmentsService.createUserAppointmentsByUserId(user.id, appointments, i18n)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  updateUserAppointmentById(
    @Param('id') id: string,
    @Body() params: UserAppointmentsOptionalParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userAppointmentsService.updateUserAppointmentById(id, params, i18n)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  deleteUserAppointmentById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userAppointmentsService.deleteUserAppointmentById(id, i18n)
  }
}
