import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Param, Post, Req, Patch, Delete } from '@nestjs/common'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { OptionsResponseDto } from '../../../core/dtos/response/options.dto'
import { Procedure } from '../../../constants/enums/procedures.constants'

import { UserProceduresService } from './user-procedures.service'

import { GetUserProcedureEntityDto, GetUserProcedureResponseDto } from './dto/user-procedures.response.dto'
import { UserProceduresBodyParamsDto } from './dto/user-procedures.dto'
import { Timezone } from '../../../core/decorators/timezone.decorator'

@ApiTags('User Procedures')
@Controller('user/procedures')
export class UserProceduresController {
  constructor(private userProceduresService: UserProceduresService) {}

  @Get('interval')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getUserProcedureFrequency() {
    return this.userProceduresService.getUserProcedureFrequency()
  }

  @Get('periods')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getUserProcedurePeriods() {
    return this.userProceduresService.getUserProcedurePeriods()
  }

  @Get('recurrence/:procedure')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getUserProcedureRecurrencePeriods(@Param('procedure') procedure: Procedure) {
    return this.userProceduresService.getUserProcedureRecurrencePeriods(procedure)
  }

  @Get()
  @ApiResponse({ status: 200, type: GetUserProcedureResponseDto, isArray: true })
  getUserAppointmentsByUserId(@Req() { user }) {
    return this.userProceduresService.getUserProceduresByUserId(user.id)
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GetUserProcedureEntityDto })
  getUserProcedureById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userProceduresService.getUserProcedureById(id, i18n)
  }

  @Post()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  createUserProcedureByUserId(
    @Timezone() timezone: string,
    @Req() { user },
    @Body() body: UserProceduresBodyParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userProceduresService.createUserProcedureByUserId(user.id, body, i18n, timezone)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  updateUserProcedureById(
    @Timezone() timezone: string,
    @Param('id') id: string,
    @Body() body: UserProceduresBodyParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userProceduresService.updateUserProcedureById(id, body, i18n, timezone)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  deleteUserProcedureById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userProceduresService.deleteUserProcedureById(id, i18n)
  }
}
