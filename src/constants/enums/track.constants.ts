import { ascOrDesc, Order } from './pagination.constants'

export enum TrackGroupSchedulePeriod {
  Daily = 'daily',
  EveryOtherDay = 'every_other_day',
  OncePerThreeDays = 'once_per_3_days',
  OncePerSevenDays = 'once_per_7_days',
  OncePerFourteenDays = 'once_per_14_days',
  OncePerThirtyDays = 'once_per_30_days',
}

export const trackTitleMaxLen = 128

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
