import { Order } from '../../constants/enums/pagination.constants'

export const arraySortByDate = <A>(array: Array<A>, field: keyof A, order: Order): Array<A> => {
  return array.sort((a, b) => {
    const timestampA = a[field]
    const timestampB = b[field]

    if (timestampA instanceof Date && timestampB instanceof Date) {
      return order === Order.ASC
        ? timestampA.getTime() - timestampB.getTime()
        : timestampB.getTime() - timestampA.getTime()
    }
  })
}
