export const toPeriodicNumbersArray = (number: number) => {
  return Array.from({ length: number }, (v, k) => k + 1)
}
