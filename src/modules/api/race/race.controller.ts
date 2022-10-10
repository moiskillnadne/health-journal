import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RaceCrudService } from './race.crud'

@ApiTags('Race')
@Controller('race')
export class RaceController {
  constructor(private raceCrudService: RaceCrudService) {}

  @Get()
  getRaceList() {
    return this.raceCrudService.getRaceList()
  }
}
