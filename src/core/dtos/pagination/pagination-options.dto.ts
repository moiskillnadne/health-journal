import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min, Matches } from 'class-validator'
import * as PaginationConstants from '../../../constants/enums/pagination.constants'
import { IPaginationOptions, IPreparedOrderOption } from '../../../models/pagination.models'
import { messageWrapper } from '../../helpers/class-validation'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { Order } from '../../../constants/enums/pagination.constants'

export class PaginationOptionsDTO implements IPaginationOptions {
  @IsOptional()
  @Matches(PaginationConstants.orderFieldPattern, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormat))
  readonly order?: string = PaginationConstants.defaultOrderValue

  @ApiPropertyOptional({
    minimum: 1,
    default: PaginationConstants.defaultPageNumber,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = PaginationConstants.defaultPageNumber

  @ApiPropertyOptional({
    minimum: PaginationConstants.minPageItemsCount,
    maximum: PaginationConstants.maxPageItemsCount,
    default: PaginationConstants.defaultPageItemsCount,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PaginationConstants.minPageItemsCount)
  @Max(PaginationConstants.maxPageItemsCount)
  @IsOptional()
  readonly take?: number = PaginationConstants.defaultPageItemsCount

  static parseOrder(rawOrder: string): IPreparedOrderOption {
    const parsedOrder = rawOrder
      .trim()
      .split(PaginationConstants.orderFieldAndOrderSeparator)
      .filter((v) => v !== '')
      .map((v: string) => v.trim())

    return {
      field: parsedOrder[0],
      sort: <Order>parsedOrder[1].toUpperCase(),
    }
  }
}
