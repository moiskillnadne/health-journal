import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ProceduresService } from './procedures.service'

@ApiTags('Procedures')
@Controller('procedures')
export class ProceduresController {
  constructor(private proceduresService: ProceduresService) {}

  @Get()
  getProceduresList() {
    return this.proceduresService.getProcedures()
  }
}
