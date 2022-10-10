export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const defaultPageNumber = 1
export const defaultPageItemsCount = 10
export const maxPageItemsCount = 50
export const minPageItemsCount = 1
export const defaultOrderField = 'createAt'
export const defaultOrder = Order.ASC
export const defaultOrderValue = `${defaultOrderField} ${defaultOrder}`
export const orderFieldsSeparator = ','
export const orderFieldAndOrderSeparator = ' '

export const ascOrDesc = `(${Order.ASC}|${Order.DESC}|${Order.ASC.toLowerCase()}|${Order.DESC.toLowerCase()})`

/**
 * pattern: ^( *\\w+( +(ASC|DESC|asc|desc)))$
 * Allowed values:
 * fieldName asc
 * fieldName desc
 */
export const orderFieldPattern = new RegExp(`^( *\\w+(${orderFieldAndOrderSeparator}+${ascOrDesc}))$`)
