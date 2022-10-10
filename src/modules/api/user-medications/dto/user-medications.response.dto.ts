import { IntersectionType, OmitType, PickType } from '@nestjs/swagger'

import { UserMedicationsEntity } from '../../../../database/entities/user-medications.entity'

export class GetUserMedicationInfoDto {
  name: string
  dose: string
}

export class GetUserMedicationResponseDto extends IntersectionType(
  GetUserMedicationInfoDto,
  PickType(UserMedicationsEntity, [
    'id',
    'medicationProductId',
    'status',
    'frequency',
    'period',
    'amount',
    'currency',
  ] as const),
) {}

export class PostUserMedicationsResponseDto extends OmitType(UserMedicationsEntity, ['user', 'medication'] as const) {}
