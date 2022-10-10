import { ascOrDesc, Order } from '../enums/pagination.constants'

export const defaultOrder = Order.DESC
export const defaultOrderField = 'updateAt'
export const defaultOrderValue = `${defaultOrderField} ${defaultOrder}`
export const allowedOrderFields = ['createAt', 'lastLoginAt', 'updateAt']

/**
 * pattern: ^( *(createAt|lastLoginAt|updateAt))( +(ASC|DESC|asc|desc))))$
 * Allowed values:
 * createAt
 * createAt asc
 * createAt desc
 * updateAt
 * updateAt asc
 * updateAt desc
 * lastLoginAt
 * lastLoginAt asc
 * lastLoginAt desc
 */
export const orderFieldPattern = new RegExp(`^( *(${allowedOrderFields.join('|')})( +${ascOrDesc})?)$`)
