import { ascOrDesc, Order } from './pagination.constants'

export enum GalleryTypes {
  video = 'video',
  article = 'article',
  recipe = 'recipe',
}

export enum VideoTypes {
  regular = 'regular',
  food = 'food',
}

export const galleryVideoTitleMaxLen = 128
export const galleryVideoKeywordMaxLen = 128
export const galleryVideoDescriptionMaxLen = 5000

export const galleryArticleTitleMaxLen = 128
export const galleryArticleKeywordMaxLen = 128
export const galleryArticleSummaryMaxLen = 256
export const galleryArticleTextMaxLen = 5000

export const galleryRecipeTitleMaxLen = 128
export const galleryRecipeKeywordMaxLen = 128
export const galleryRecipeSummaryMaxLen = 256
export const galleryRecipeTextMaxLen = 5000

export const galleryVideoPreviewPresignLinkExpires = 15 // min
export const galleryArticlesImagePresignedLinkExpires = 15 // min
export const galleryVideoSourcePresignedLinkExpires = 30 // min
export const galleryRecipeImagePresignedLinkExpires = 15 // min
export const foodPdfPresignedLinkExpires = 60 // min
export const foodPreviewImagePresignedLinkExpires = 60 // min
export const notificationImagePresignedLinkExpires = 24 * 60 // min

export const defaultOrder = Order.DESC
export const defaultOrderField = 'updateAt'
export const defaultOrderValue = `${defaultOrderField} ${defaultOrder}`
export const allowedOrderFields = ['createAt', 'updateAt']
/**
 * pattern: ^( *(createAt|updateAt)( +(ASC|DESC|asc|desc))))$
 * Allowed values:
 * createAt
 * createAt asc
 * createAt desc
 * updateAt
 * updateAt asc
 * updateAt desc
 */
export const orderFieldPattern = new RegExp(`^( *(${allowedOrderFields.join('|')})( +${ascOrDesc}))$`)
