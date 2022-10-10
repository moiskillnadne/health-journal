import { ArrayMinSize, IsArray, IsOptional, IsUUID, Matches, IsBoolean } from 'class-validator'
import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger'
import { defaultOrderValue, orderFieldPattern } from '../../../../constants/enums/storage.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { Transform } from 'class-transformer'
import { StorageEntity } from '../../../../database/entities/storage.entity'

export class BatchDeleteBodyDTO {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(4, { each: true })
  ids: string[]
}

export class StoragePaginationOptionsDTO extends PaginationOptionsDTO {
  @ApiPropertyOptional({
    name: 'order',
    default: defaultOrderValue,
    enum: ['createAt asc', 'createAt desc', 'fileName asc', 'fileName desc'],
  })
  @IsOptional()
  @Matches(orderFieldPattern, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormatStorage))
  readonly order?: string = defaultOrderValue
}

export class StorageSearchDTO {
  @IsOptional()
  @ApiPropertyOptional()
  readonly search?: string
}

export class StorageListingOptionsDTO extends IntersectionType(StoragePaginationOptionsDTO, StorageSearchDTO) {}

export class StorageUploadParamsDTO {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  @IsBoolean()
  readonly force: boolean = false
}

export class GetStorageResponseDTO extends StorageEntity {}
