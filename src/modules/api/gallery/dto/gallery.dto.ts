import { DictionaryPathToken } from './../../../../constants/dictionary.constants'
import { IsBoolean } from 'class-validator'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { OmitType, PartialType } from '@nestjs/swagger'

export class PatchUserRecordsStatusParamsDto {
  @IsBoolean(messageWrapper(DictionaryPathToken.InvalidFormat))
  isFavorite: boolean

  @IsBoolean(messageWrapper(DictionaryPathToken.InvalidFormat))
  isVisited: boolean

  @IsBoolean(messageWrapper(DictionaryPathToken.InvalidFormat))
  isViewed: boolean
}

export class PatchUserRecordsStatusOptionalParamsDto extends PartialType(PatchUserRecordsStatusParamsDto) {}

export class PatchUserVideoStatusParamsDto extends PatchUserRecordsStatusOptionalParamsDto {}

export class PatchUserArticleStatusOptionalParamsDto extends OmitType(PatchUserRecordsStatusOptionalParamsDto, [
  'isViewed',
] as const) {}
