import { OptionsResponseDto } from './../../../core/dtos/response/options.dto'
import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'

import { MedicationsService } from './medications.service'

import { MedicationsPaginationOptionalParamsDto } from './dto/medications.dto'
import { MedicationsAdminSearchDto, MedicationsParamsResponseDto } from './dto/medications-response.dto'
import { ApiPageResponse } from '../../../core/decorators/swagger/api-page-response.decorator'
import { PageDTO } from '../../../core/dtos/pagination'

@ApiTags('Medications')
@Controller(['medications', '/web-admin/medications'])
export class MedicationsController {
  constructor(private medicationsService: MedicationsService) {}

  @Get('/search')
  @ApiPageResponse(MedicationsParamsResponseDto, { status: 200 })
  @ApiExtraModels(PageDTO, MedicationsParamsResponseDto)
  getMedicationNamesByParams(@Query() params: MedicationsPaginationOptionalParamsDto) {
    return this.medicationsService.getMedicationNamesByParams(params)
  }

  @Get('/adminSearch')
  @ApiPageResponse(MedicationsAdminSearchDto, { status: 200 })
  @ApiExtraModels(PageDTO, MedicationsAdminSearchDto)
  getMedicationsDataByParams(@Query() params: MedicationsPaginationOptionalParamsDto) {
    return this.medicationsService.getMedicationNamesIdsByParams(params)
  }

  @Get(':name')
  @ApiResponse({ status: 200, type: OptionsResponseDto, isArray: true })
  getMedicationDosesByName(@Param('name') name: string) {
    return this.medicationsService.getMedicationDosesByName(name)
  }
}
