import { ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { applyDecorators, Type } from '@nestjs/common'
import { PageDTO } from '../../dtos/pagination'

export const ApiPageResponse = <TModel extends Type<any>>(model: TModel, options: ApiResponseOptions) => {
  return applyDecorators(
    ApiResponse({
      ...options,
      ...{
        schema: {
          allOf: [
            { $ref: getSchemaPath(PageDTO) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                },
              },
            },
          ],
        },
      },
    }),
  )
}
