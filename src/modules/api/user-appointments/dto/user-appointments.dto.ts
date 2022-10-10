import { PartialType } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsDate, IsUUID, ValidateNested, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserAppointmentsParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsUUID(4, messageWrapper(DictionaryPathToken.InvalidFormat))
  public id: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public speciality: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public doctor: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserAppointmentsOptionalParamsDto extends PartialType(UserAppointmentsParamsDto) {}

export class UserAppointmentsParentOptionalParamsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAppointmentsOptionalParamsDto)
  public appointments: UserAppointmentsOptionalParamsDto[]
}
