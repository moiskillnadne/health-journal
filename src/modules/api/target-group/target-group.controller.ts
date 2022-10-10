import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { TargetGroupCrud } from './target-group.crud'
import { TargetGroupResponseDTO } from './target-group.dto'

@ApiTags('Target Groups')
@Controller(['/web-admin/target-group'])
export class TargetGroupController {
  constructor(private readonly targetGroupCrud: TargetGroupCrud) {}

  @Get()
  @ApiResponse({ status: 200, type: TargetGroupResponseDTO, isArray: true })
  getTargetGroups(): Promise<TargetGroupResponseDTO[]> {
    return this.targetGroupCrud.getTargetGroupsLists()
  }
}
