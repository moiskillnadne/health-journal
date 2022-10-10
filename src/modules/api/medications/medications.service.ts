import { OptionsResponseDto } from './../../../core/dtos/response/options.dto'
import { Injectable } from '@nestjs/common'

import { MedicationsCrudService } from './medications.crud'

import { MedicationsPaginationOptionalParamsDto } from './dto/medications.dto'
import { PageDTO } from '../../../core/dtos/pagination'
import { MedicationsEntity } from '../../../database/entities/medications.entity'
import { MedicationsAdminSearchDto } from './dto/medications-response.dto'

@Injectable()
export class MedicationsService {
  constructor(private medicationsCrudService: MedicationsCrudService) {}

  public getMedicationNamesByParams(
    params: MedicationsPaginationOptionalParamsDto,
  ): Promise<PageDTO<MedicationsEntity>> {
    return this.medicationsCrudService.getMedicationNamesByParams(params)
  }
  public getMedicationNamesIdsByParams(
    params: MedicationsPaginationOptionalParamsDto,
  ): Promise<PageDTO<Array<MedicationsAdminSearchDto>>> {
    return this.medicationsCrudService.getMedicationNamesIdsByParams(params)
  }

  public getMedicationDosesByName(name: string): Promise<OptionsResponseDto[]> {
    return this.medicationsCrudService.getMedicationDosesByName(name)
  }
}
