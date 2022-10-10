import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import {
  IsLimitedString,
  IsListRelationUIIDs,
  IsNotEmptyRelationUIID,
} from '../../../../../core/decorators/gallery.decorators'
import { TrackGroupSchedulePeriod, trackTitleMaxLen } from '../../../../../constants/enums/track.constants'
import { ValidateSequenceNestedProperty } from '../../../../../core/decorators/validate-sequence.decorator'
import { Type } from 'class-transformer'

export class PatchTrackGroupLineDTO {
  @IsOptional()
  @IsUUID()
  id?: string

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

export class PatchTrackGroupDto {
  @IsOptional()
  @IsUUID()
  id?: string

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
  @Type(() => PatchTrackGroupLineDTO)
  lines: PatchTrackGroupLineDTO[]
}

export class PatchTrackDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsLimitedString(trackTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(trackTitleMaxLen)
  titleSp: string

  @IsOptional()
  @IsListRelationUIIDs()
  @ArrayNotEmpty()
  targetGroups: string[]

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateSequenceNestedProperty('order')
  @ValidateNested({ each: true })
  @Type(() => PatchTrackGroupDto)
  groups: PatchTrackGroupDto[]

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}
