import { OmitType } from '@nestjs/swagger'
import { ConditionsEntity } from '../../../database/entities/conditions.entity'

export class GetConditionListResponseDto extends OmitType(ConditionsEntity, ['conditions'] as const) {}
