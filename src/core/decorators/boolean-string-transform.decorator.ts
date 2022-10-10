import { Transform } from 'class-transformer'

export function TransformBooleanString() {
  return Transform(({ value }) =>
    typeof value === 'string' && ['true', 'false'].includes(value.toLowerCase())
      ? value.toLowerCase() === 'true'
      : value,
  )
}
