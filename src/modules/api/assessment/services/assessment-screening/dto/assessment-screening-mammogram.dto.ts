import { IntersectionType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { messageWrapper } from '../../../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../../../constants/dictionary.constants'

import {
  UserProceduresBodyParamsDto,
  UserProceduresOptionalParamsDto,
} from '../../../../user-procedures/dto/user-procedures.dto'
import { UserCardProfileMammogramScreeningOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'

export class AssessmentScreeningMammogramTestParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserProceduresOptionalParamsDto)
  public mammogram: UserProceduresBodyParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public remindMammogramInThreeMonth: boolean
}

export class AssessmentScreeningMammogramTestOptionalParamsDto extends PartialType(
  AssessmentScreeningMammogramTestParamsDto,
) {}

export class AssessmentScreeningMammogramParamsDto extends IntersectionType(
  AssessmentScreeningMammogramTestOptionalParamsDto,
  UserCardProfileMammogramScreeningOptionalParamsDto,
) {}
