import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetConditionListResponseDto } from './conditions-response.dto'

import { ConditionsCrudService } from './conditions.crud'

@ApiTags('Conditions')
@Controller(['conditions', '/web-admin/conditions'])
export class ConditionsController {
  constructor(private conditionsCrudService: ConditionsCrudService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetConditionListResponseDto })
  getConditionsList() {
    return this.conditionsCrudService.getConditionsList()
  }
}
