import { Injectable } from '@nestjs/common'
import { ProceduresCrudService } from './procedures.crud'

@Injectable()
export class ProceduresService {
  constructor(private proceduresCrudService: ProceduresCrudService) {}

  public async getProcedures() {
    const list = await this.proceduresCrudService.getProceduresList()

    return list.sort((a, b) => a.order - b.order)
  }
}
