import { HttpStatus, Injectable } from '@nestjs/common'
import { StorageCrud } from './storage.crud'
import { NotFoundError } from '../../../core/errors/not-found.error'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { StorageContentTypes } from '../../../constants/enums/storage.constants'
import { ValidationError } from '../../../core/errors/validation.error'
import { I18nContext } from 'nestjs-i18n'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { InternalServerError } from '../../../core/errors/internal-server.error'

@Injectable()
export class StorageService {
  constructor(private storageCrud: StorageCrud) {}

  async incrementViewsCount(storageItemId: string, i18n: I18nContext) {
    const storageItem = await this.storageCrud.getStorageItemByIds(storageItemId)

    if (!storageItem) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.StorageItemNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    if (storageItem.contentType !== StorageContentTypes.video) {
      throw new ValidationError(
        i18n.t(DictionaryPathToken.StorageItemHasInvalidTypeToIncrementViewsCount),
        ErrorCodes.ValidationFailedViewsCountSupportsOnlyVideoStorageItems,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.storageCrud.incrementViewsCount(storageItem)
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.StorageFailedIncrementViewsCount),
        ErrorCodes.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }
}
