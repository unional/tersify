import { TersifyContext } from './interfaces';
import { tersifyValue } from './tersifyValue';
import { trim } from './trim';
import { isTersible } from '../tersible';

export function tersifyArray(context: TersifyContext, value: any[], length: number) {
  const ref = context.references.find(r => r.value === value)
  if (ref) {
    return `ref(${ref.path.join(', ')})`
  }

  context.references.push({ value, path: context.path })

  if (!context.raw && isTersible(value)) {
    return value.tersify({ maxLength: length })
  }

  if (value.length === 0) return `[]`

  const bracketLen = 2
  let entriesLen = 0
  const commaAndSpaceLen = 2
  const entries = value.reduce((entries: string[], v, i) => {
    const path = [...context.path, i]
    const str = tersifyValue({ ...context, path }, v, length - entriesLen)
    entriesLen += str.length
    if (i !== value.length - 1) entriesLen += commaAndSpaceLen
    entries.push(str)
    return entries
  }, [] as string[])
  const content = trim(context, entries.join(', '), length - bracketLen)
  if (content.length === 0) return trim(context, `[ ]`, length)
  return `[${content}]`
}
