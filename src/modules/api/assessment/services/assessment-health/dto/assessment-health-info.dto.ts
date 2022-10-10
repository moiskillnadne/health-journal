import { PartialType, IntersectionType } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { messageWrapper } from '../../../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../../../constants/dictionary.constants'

import { UserCardMoreHealthOptionalParamsDto } from '../../../../user-card/dto/user-card.dto'
import { UserCardHba1cDateOptionalParamsDto } from '../../../../user-card-hba1c/dto/user-card-hba1c.dto'
import { UserCardSugarDateOptionalParamsDto } from '../../../../user-card/dto/user-card-sugar.dto'
import { UserCardProfileDiabeticEyeExamOptionalParamsDto } from '../../../../user-card-profile/dto/user-card-profile.dto'

export class AssessmentMoreHealthGeneralParamsDto {
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public lastDiabeticEyeExam: Date

  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public nextDiabeticEyeExam: Date

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardHba1cDateOptionalParamsDto)
  public hba1c: UserCardHba1cDateOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public randomBloodSugar: UserCardSugarDateOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public fastingBloodSugar: UserCardSugarDateOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public afterMealBloodSugar: UserCardSugarDateOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public ldl: UserCardSugarDateOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public triglyceride: UserCardSugarDateOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public remindDiabeticEyeExamInOneMonth: boolean
}

export class AssessmentMoreHealthGeneralOptionalParamsDto extends PartialType(AssessmentMoreHealthGeneralParamsDto) {}

export class AssessmentHealthInfoParamsDto extends IntersectionType(
  IntersectionType(UserCardMoreHealthOptionalParamsDto, UserCardProfileDiabeticEyeExamOptionalParamsDto),
  AssessmentMoreHealthGeneralOptionalParamsDto,
) {}
