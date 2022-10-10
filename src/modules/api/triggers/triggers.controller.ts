import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { TriggersCrudService } from './triggers.crud'

@ApiTags('Triggers')
@Controller(['triggers', '/web-admin/triggers'])
export class TriggersController {
  constructor(private triggersCrudService: TriggersCrudService) {}

  @Get()
  getTriggersList() {
    return this.triggersCrudService.getTriggersList()
  }
}
