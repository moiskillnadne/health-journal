import { Order, ascOrDesc } from './pagination.constants'

export enum StorageContentTypes {
  video = 'video',
  image = 'image',
}

export enum StorageFoodContentTypes {
  pdf = 'pdf',
}

export enum StorageFileFormats {
  mp4 = 'mp4',
  png = 'png',
  jpeg = 'jpeg',
  jpg = 'jpg',
}

export enum StorageFoodFileFormats {
  pdf = 'pdf',
}

export enum ProfilePhotoImageFormats {
  png = StorageFileFormats.png,
  jpeg = StorageFileFormats.jpeg,
  jpg = StorageFileFormats.jpg,
}

export const FileFormatContentTypeMap = {
  mp4: StorageContentTypes.video,
  png: StorageContentTypes.image,
  jpeg: StorageContentTypes.image,
  jpg: StorageContentTypes.image,
}
export const AllowedVideoFileFormats = [StorageFileFormats.mp4]
export const AllowedImageFileFormats = [StorageFileFormats.png, StorageFileFormats.jpeg, StorageFileFormats.jpg]
export const AllowedFileFormats = [...AllowedVideoFileFormats, ...AllowedImageFileFormats]

export enum MaxFileSize {
  video = 1024 * 1024 * 100, // 100 mb
  image = 1024 * 1024 * 20, // 20 mb
}

export const defaultOrder = Order.DESC
export const defaultOrderField = 'createAt'
export const defaultOrderValue = `${defaultOrderField} ${defaultOrder}`
export const allowedOrderFields = ['createAt', 'fileName']

export const imagesUploadingLimit = null // null is infinity
export const videosUploadingLimit = null // null is infinity

/**
 * pattern: ^( *createAt( +(ASC|DESC|asc|desc))))$
 * Allowed values:
 * createAt asc
 * createAt desc
 */
export const orderFieldPattern = new RegExp(`^( *(${allowedOrderFields.join('|')})( +${ascOrDesc}))$`)
