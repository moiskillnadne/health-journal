import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  ValidateIf,
  IsPositive,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  IsLimitedString,
  IsListRelationUIIDs,
  IsNotEmptyRelationUIID,
} from '../../../../../core/decorators/gallery.decorators'
import { TrackGroupSchedulePeriod, trackTitleMaxLen } from '../../../../../constants/enums/track.constants'
import { ValidateSequenceNestedProperty } from '../../../../../core/decorators/validate-sequence.decorator'
import { TrackResponseDTO } from './track.dto'

class AddTrackGroupLineDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  order: number

  @ValidateIf((object) => !object.article && !object.recipe)
  @IsNotEmptyRelationUIID()
  video: string

  @ValidateIf((object) => !object.video && !object.recipe)
  @IsNotEmptyRelationUIID()
  article: string

  @ValidateIf((object) => !object.article && !object.video)
  @IsNotEmptyRelationUIID()
  recipe: string
}

export class AddTrackGroupDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  order: number

  @IsNotEmpty()
  @IsEnum(TrackGroupSchedulePeriod)
  schedule: TrackGroupSchedulePeriod

  @IsArray()
  @ArrayNotEmpty()
  @ValidateSequenceNestedProperty('order')
  @ValidateNested({ each: true })
  @Type(() => AddTrackGroupLineDTO)
  lines: AddTrackGroupLineDTO[]
}

export class AddTrackDTO {
  @IsNotEmpty()
  @IsLimitedString(trackTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(trackTitleMaxLen)
  titleSp: string

  @IsListRelationUIIDs()
  @ArrayNotEmpty()
  targetGroups: string[]

  @IsArray()
  @ArrayNotEmpty()
  @ValidateSequenceNestedProperty('order')
  @ValidateNested({ each: true })
  @Type(() => AddTrackGroupDto)
  groups: AddTrackGroupDto[]

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}

export class AddTrackResponseDTO extends TrackResponseDTO {}
