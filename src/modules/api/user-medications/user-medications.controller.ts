import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { OptionsResponseDto } from '../../../core/dtos/response/options.dto'

import { UserMedicationsService } from './user-medications.service'

import { GetUserMedicationResponseDto } from './dto/user-medications.response.dto'
import { UserMedicationsOptionalParamsDto, UserMedicationsQueryParamsDto } from './dto/user-medications.dto'

@ApiTags('User Medications')
@Controller('user/medications')
export class UserMedicationsController {
  constructor(private userMedicationsService: UserMedicationsService) {}

  @Get('frequency')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getUserMedicationFrequency() {
    return this.userMedicationsService.getUserMedicationFrequency()
  }

  @Get('periods')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getUserMedicationPeriods() {
    return this.userMedicationsService.getUserMedicationPeriods()
  }

  @Get('currency')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getUserMedicationCurrency() {
    return this.userMedicationsService.getUserMedicationCurrency()
  }

  @Get()
  @ApiResponse({ status: 200, type: GetUserMedicationResponseDto, isArray: true })
  getUserMedicationsByUserId(@Req() { user }, @Query() params: UserMedicationsQueryParamsDto) {
    return this.userMedicationsService.getUserMedicationsByUserId(user.id, params)
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GetUserMedicationResponseDto })
  getUserMedicationById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userMedicationsService.getUserMedicationById(id, i18n)
  }

  @Post()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  createUserMedicationsByUserId(
    @Req() { user },
    @Body(new ParseArrayPipe({ items: UserMedicationsOptionalParamsDto }))
    medications: UserMedicationsOptionalParamsDto[],
    @I18n() i18n: I18nContext,
  ) {
    return this.userMedicationsService.createUserMedicationsByUserId(user.id, medications, i18n)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  updateUserMedicationById(
    @Param('id') id: string,
    @Body() params: UserMedicationsOptionalParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userMedicationsService.updateUserMedicationById(id, params, i18n)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  deleteUserMedicationById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userMedicationsService.deleteUserMedicationById(id, i18n)
  }
}
