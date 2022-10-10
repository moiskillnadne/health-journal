import { Transform } from 'class-transformer'

export function TransformArrayRemoveDuplicates() {
  return Transform(({ value }) => (Array.isArray(value) ? Array.from(new Set(value)) : value))
}
