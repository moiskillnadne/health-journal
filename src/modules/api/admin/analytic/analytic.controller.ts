import { Controller, Query, Get, Response } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AnalyticGetOptionsDTO } from './analytic.dto'
import { AnalyticService } from './analytic.service'
import { AnalyticReportContentType } from '../../../../constants/enums/admin/analytics.constants'
import { InternalServerErrorResponse } from '../../../../core/dtos/response/internal-server-error.dto'
import { RequirePermissions } from '../../../../core/decorators/permissions.decorators'
import { AnalyticPermissions } from '../../../../constants/permissions/admin.constants'

@ApiTags('Admin Analytics')
@Controller('/web-admin/analytic')
export class AnalyticController {
  constructor(private analyticService: AnalyticService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success response',
    content: {
      [AnalyticReportContentType.csv]: {
        example: 'File content',
      },
      [AnalyticReportContentType.zip]: {
        example: 'File content',
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(AnalyticPermissions.canView)
  async getAnalyticReports(
    @Query() analyticGetOptionsDTO: AnalyticGetOptionsDTO,
    @Response({ passthrough: true }) res,
  ) {
    const { buffer, fileName, contentType } = await this.analyticService.getAnalyticReports(analyticGetOptionsDTO)
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
    res.setHeader('Content-Type', contentType)
    res.end(buffer)
  }
}
