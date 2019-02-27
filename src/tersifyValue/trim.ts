import { TersifyContext } from './interfaces';

export function trim({ raw, noTrim }: TersifyContext, value: string, length: number) {
  if (noTrim || raw || value.length <= length) return value
  const trimmed = value.slice(0, Math.max(length, 0))

  const dots = trimmed.length === 0 ? '' :
    trimmed.length <= 3 ? '.' :
      trimmed.length === 4 ? '..' : '...'
  return trimmed.slice(0, trimmed.length - dots.length) + dots
}
