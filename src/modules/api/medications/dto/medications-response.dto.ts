import { OmitType } from '@nestjs/swagger'
import { MedicationsEntity } from '../../../../database/entities/medications.entity'

export class MedicationsAdminSearchDto {
  name: string
  productId: string
}

export class MedicationsParamsResponseDto extends OmitType(MedicationsEntity, ['medications'] as const) {}
