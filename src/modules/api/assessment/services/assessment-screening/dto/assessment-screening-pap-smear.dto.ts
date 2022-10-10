import { IntersectionType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { messageWrapper } from '../../../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../../../constants/dictionary.constants'

import {
  UserProceduresBodyParamsDto,
  UserProceduresOptionalParamsDto,
} from '../../../../user-procedures/dto/user-procedures.dto'
import { UserCardProfilePapSmearScreeningOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'

export class AssessmentScreeningPapSmearTestParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserProceduresOptionalParamsDto)
  public papSmear: UserProceduresBodyParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public remindPapSmearInThreeMonth: boolean
}

export class AssessmentScreeningPapSmearTestOptionalParamsDto extends PartialType(
  AssessmentScreeningPapSmearTestParamsDto,
) {}

export class AssessmentScreeningPapSmearParamsDto extends IntersectionType(
  AssessmentScreeningPapSmearTestOptionalParamsDto,
  UserCardProfilePapSmearScreeningOptionalParamsDto,
) {}
