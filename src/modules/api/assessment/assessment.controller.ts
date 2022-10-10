import { BaseSuccessResponse } from './../../../core/dtos/response/base-success.dto'
import { Body, Controller, Post, Req } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { IBaseResponse } from '../../../models/response.models'

import { AssessmentService } from './assessment.service'

import { AssessmentPersonalInfoParamsDto } from './dto/assessment-personal-info.dto'
import { AssessmentSummaryInfoParamsDto } from './dto/assessment-summary-info.dto'
import { Timezone } from '../../../core/decorators/timezone.decorator'

@ApiTags('Assessment')
@Controller('assessment')
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Post('personal')
  @ApiOkResponse({ type: BaseSuccessResponse })
  addAssessmentPersonalInfoByUserId(
    @Req() { user },
    @Body() params: AssessmentPersonalInfoParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.assessmentService.addAssessmentPersonalInfoByUserId(user.id, params, i18n)
  }

  @Post('summary')
  @ApiOkResponse({ type: BaseSuccessResponse })
  addAssessmentSummaryInfoByUserId(
    @Timezone() timezone: string,
    @Req() { user },
    @Body() params: AssessmentSummaryInfoParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.assessmentService.addAssessmentSummaryInfoByUserId(user.id, params, i18n, timezone)
  }
}
