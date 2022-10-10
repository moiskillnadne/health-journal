import { PartialType, IntersectionType } from '@nestjs/swagger'
import { IsString } from 'class-validator'

import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class MedicationsParamsDto {
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public name: string
}

export class MedicationsOptionalParamsDto extends PartialType(MedicationsParamsDto) {}

export class MedicationsPaginationOptionalParamsDto extends IntersectionType(
  MedicationsOptionalParamsDto,
  PaginationOptionsDTO,
) {}
