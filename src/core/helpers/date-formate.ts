import { MonthEn } from '../../constants/enums/month'

export const formateDateToUSAView = (date: Date) => {
  return `${MonthEn[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
