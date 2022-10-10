import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'
import { PageMetaDTO } from './page-meta.dto'
import { IPaginationResponse } from '../../../models/pagination.models'

export class PageDTO<T> implements IPaginationResponse<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[]

  @ApiProperty({ type: () => PageMetaDTO })
  readonly meta: PageMetaDTO

  constructor(data: T[], meta: PageMetaDTO) {
    this.data = data
    this.meta = meta
  }
}
