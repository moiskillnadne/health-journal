import { PartialType, PickType } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, IsEnum, Min, Max, ValidateNested, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { Period } from '../../../../constants/enums/period.constants'
import { Currency } from '../../../../constants/enums/currency.constants'
import { Status } from '../../../../constants/enums/medications.constants'

export class UserMedicationsParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public id: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Min(1)
  @Max(12)
  public frequency: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(Period, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period: Period

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  public amount: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(Currency, messageWrapper(DictionaryPathToken.InvalidFormat))
  public currency: Currency

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(Status, messageWrapper(DictionaryPathToken.InvalidFormat))
  public status: Status
}

export class UserMedicationsOptionalParamsDto extends PartialType(UserMedicationsParamsDto) {}

export class UserMedicationsQueryParamsDto extends PickType(UserMedicationsOptionalParamsDto, ['status'] as const) {}

export class UserMedicationsParentParamsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserMedicationsOptionalParamsDto)
  public medications: UserMedicationsOptionalParamsDto[]
}

export class UserMedicationsParentOptionalParamsDto extends PartialType(UserMedicationsParentParamsDto) {}
