import { PartialType, PickType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { UserCardHeightOptionalParamsDto } from './user-card-height.dto'
import { UserCardWeightOptionalParamsDto } from './user-card-weight.dto'
import { UserCardSugarOptionalParamsDto } from './user-card-sugar.dto'
import { UserCardCholesterolOptionalParamsDto } from './user-card-cholesterol.dto'

export class UserCardParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardHeightOptionalParamsDto)
  public height: UserCardHeightOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardWeightOptionalParamsDto)
  public goalWeight: UserCardWeightOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public goalPressureSystolic: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public goalPressureDiastolic: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public goalHba1c: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarOptionalParamsDto)
  public goalRandomBloodSugar: UserCardSugarOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarOptionalParamsDto)
  public goalFastingBloodSugar: UserCardSugarOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarOptionalParamsDto)
  public goalAfterMealBloodSugar: UserCardSugarOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardCholesterolOptionalParamsDto)
  public goalLdl: UserCardCholesterolOptionalParamsDto

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardCholesterolOptionalParamsDto)
  public goalTriglyceride: UserCardCholesterolOptionalParamsDto

  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public goalSteps: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.InvalidFormat))
  public cpap: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public sleepGoal: number
}

export class UserCardOptionalParamsDto extends PartialType(UserCardParamsDto) {}

export class UserCardPersonalParamsDto extends PickType(UserCardParamsDto, ['height', 'goalWeight'] as const) {}

export class UserCardMoreHealthOptionalParamsDto extends PickType(UserCardOptionalParamsDto, [
  'goalHba1c',
  'goalRandomBloodSugar',
  'goalFastingBloodSugar',
  'goalAfterMealBloodSugar',
  'goalLdl',
  'cpap',
] as const) {}

export class UserCardGoalPressureOptionalParamsDto extends PickType(UserCardOptionalParamsDto, [
  'goalPressureSystolic',
  'goalPressureDiastolic',
] as const) {}
