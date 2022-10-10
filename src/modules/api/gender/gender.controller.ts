import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { GenderCrudService } from './gender.crud'

@ApiTags('Gender')
@Controller('gender')
export class GenderController {
  constructor(private genderCrudService: GenderCrudService) {}

  @Get()
  getGenderList() {
    return this.genderCrudService.getGenderList()
  }
}
