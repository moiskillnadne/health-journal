import { IntersectionType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { messageWrapper } from '../../../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../../../constants/dictionary.constants'

import { UserProceduresBodyParamsDto } from '../../../../user-procedures/dto/user-procedures.dto'
import { UserCardProfileColonScreeningOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'

export class AssessmentScreeningColonTestParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserProceduresBodyParamsDto)
  public bloodStoolTesting: UserProceduresBodyParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserProceduresBodyParamsDto)
  public cologuard: UserProceduresBodyParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserProceduresBodyParamsDto)
  public colonoscopy: UserProceduresBodyParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserProceduresBodyParamsDto)
  public colonography: UserProceduresBodyParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public remindColonScreeningInThreeMonth: boolean
}

export class AssessmentScreeningColonTestOptionalParamsDto extends PartialType(AssessmentScreeningColonTestParamsDto) {}

export class AssessmentScreeningColonParamsDto extends IntersectionType(
  AssessmentScreeningColonTestOptionalParamsDto,
  UserCardProfileColonScreeningOptionalParamsDto,
) {}
