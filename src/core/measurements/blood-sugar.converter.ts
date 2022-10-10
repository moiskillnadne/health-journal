// 1 mg/dL equals approximately 0.055 mmol/L.
// Therefore, in order to convert from mg/dL to mmol/L,
// the glucose value needs to be multiplied by 0.0555.

const equivalent = 0.0555

export const convertMgDlToMmolL = (count: number): number => {
  return count * equivalent
}

export const convertMmolLToMgDl = (count: number): number => {
  return Math.round(count / equivalent)
}
