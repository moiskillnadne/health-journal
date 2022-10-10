import { ApiProperty } from '@nestjs/swagger'
import { IPageMetaDTOParameters, IPreparedOrderOption } from '../../../models/pagination.models'
import { PaginationOptionsDTO } from './pagination-options.dto'

export class PageMetaDTO {
  @ApiProperty()
  readonly page: number

  @ApiProperty()
  readonly take: number

  @ApiProperty()
  readonly itemCount: number

  @ApiProperty()
  readonly pageCount: number

  @ApiProperty()
  readonly hasPreviousPage: boolean

  @ApiProperty()
  readonly hasNextPage: boolean

  @ApiProperty()
  readonly order: IPreparedOrderOption

  constructor({ paginationOptionsDto, itemCount }: IPageMetaDTOParameters) {
    this.page = paginationOptionsDto.page
    this.take = paginationOptionsDto.take
    this.order = PaginationOptionsDTO.parseOrder(paginationOptionsDto.order)

    this.itemCount = itemCount
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}
