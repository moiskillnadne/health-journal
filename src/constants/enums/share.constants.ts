import { Period } from './period.constants'

export const periodToPdfFormatted = {
  [Period.Daily]: 'a Day',
  [Period.Weekly]: 'a Week',
  [Period.Monthly]: 'a Month',
  [Period.Yearly]: 'a Year',
}
