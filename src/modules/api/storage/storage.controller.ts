import { Controller, HttpCode, Patch } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParamUIID } from '../../../core/decorators/param-uiid.decorator'
import { StorageService } from './storage.service'
import { I18n, I18nContext } from 'nestjs-i18n'
import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { NotFoundResponse } from '../../../core/dtos/response/not-found-error.dto'
import { ValidationErrorInvalidStorageItemResponse } from './storage.dto'
import { InternalServerErrorResponse } from '../../../core/dtos/response/internal-server-error.dto'

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Patch('/:id/views-count/increment')
  @HttpCode(204)
  @ApiResponse({ status: 403, description: 'Forbidden. Token expired.', type: ForbiddenResponse })
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({
    status: 400,
    description: 'Invalid storage item content type',
    type: ValidationErrorInvalidStorageItemResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed increment',
    type: InternalServerErrorResponse,
  })
  async incrementViewsCount(@ParamUIID('id') id: string, @I18n() i18n: I18nContext) {
    await this.storageService.incrementViewsCount(id, i18n)
  }
}
