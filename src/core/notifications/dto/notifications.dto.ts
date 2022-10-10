import { PickType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

import { messageWrapper } from '../../helpers/class-validation'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { NotificationType } from '../../../constants/enums/notifications.constants'

export class NotificationsParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsUUID(4, messageWrapper(DictionaryPathToken.InvalidFormat))
  public userId: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(NotificationType, messageWrapper(DictionaryPathToken.InvalidFormat))
  public type: NotificationType

  @IsOptional()
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsUUID(4, messageWrapper(DictionaryPathToken.InvalidFormat))
  public procedureId?: string
}

export class NotificationsRemindBodyParamsDto extends PickType(NotificationsParamsDto, ['userId', 'type'] as const) {}

export class NotificationsStopBodyParamsDto extends NotificationsParamsDto {}
