import { applyDecorators } from '@nestjs/common'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { TransformArrayRemoveDuplicates } from './array-remove-duplicates.decorator'
import { MaxLengthHtml } from './max-length-html.decorator'

export function IsLimitedString(maxLen) {
  return applyDecorators(IsString(), MaxLength(maxLen))
}

export function IsLimitedHtml(maxLen) {
  return applyDecorators(IsString(), MaxLengthHtml(maxLen))
}

export function IsListLimitedStrings(maxLen) {
  return applyDecorators(IsArray(), IsString({ each: true }), MaxLength(maxLen, { each: true }))
}

export function IsNotEmptyListLimitedStrings(maxLen) {
  return applyDecorators(IsArray(), ArrayNotEmpty(), IsString({ each: true }), MaxLength(maxLen, { each: true }))
}

export function IsListRelationUIIDs() {
  return applyDecorators(IsArray(), IsUUID(4, { each: true }), TransformArrayRemoveDuplicates())
}

export function IsListRelationStringsIds() {
  return applyDecorators(IsArray(), IsString({ each: true }), TransformArrayRemoveDuplicates())
}

export function IsNotEmptyRelationUIID() {
  return applyDecorators(IsNotEmpty(), IsUUID(4))
}
