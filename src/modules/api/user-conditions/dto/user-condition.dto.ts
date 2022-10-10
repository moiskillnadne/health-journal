import { PartialType, PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { messageWrapper } from '../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { UserConditionsEntity } from '../../../../database/entities/user-conditions.entity'
import { ConditionsParamsDto } from '../../assessment/services/assessment-health/dto/assessment-health-conditions.dto'

export class ConditionParamsOptionalDto extends PartialType(ConditionsParamsDto) {}

export class PatchUserConditionParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  conditionId: string
}

export class GetUserConditionSearchParamsDto extends PickType(UserConditionsEntity, ['status'] as const) {}

export class GetUserConditionSearchParamsOptionalDto extends PartialType(GetUserConditionSearchParamsDto) {}
