import { OmitType } from '@nestjs/swagger'
import { UserAdditionalInformationEntity } from '../../../../database/entities/additional-information.entity'

export class AdditionalInformationResponseDto extends OmitType(UserAdditionalInformationEntity, ['user'] as const) {}
