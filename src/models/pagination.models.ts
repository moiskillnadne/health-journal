import { PageMetaDTO } from '../core/dtos/pagination'
import { Order } from '../constants/enums/pagination.constants'

export interface IPaginationResponse<T> {
  readonly data: T[]
  readonly meta: PageMetaDTO
}

export interface IPaginationOptions {
  readonly order?: string
  readonly page?: number
  readonly take?: number
}

export type IPreparedOrderOption = {
  field: string
  sort: Order
}

export interface IPageMetaDTOParameters {
  paginationOptionsDto: IPaginationOptions
  itemCount: number
}
