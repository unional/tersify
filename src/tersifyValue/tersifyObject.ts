import { TersifyContext } from './interfaces';
import { isTersible } from '../tersible';
import { tersifyValue } from './tersifyValue';
import { trim } from './trim';
export function tersifyObject(context: TersifyContext, value: object, length: number) {
  const ref = context.references.find(r => r.value === value)
  if (ref) {
    return `cir(${ref.path.join(', ')})`
  }

  context.references.push({ value, path: context.path })

  if (!context.raw && isTersible(value)) {
    return value.tersify({ maxLength: length })
  }
  const bracketLen = 4
  let remaining = length - bracketLen
  const keys = Object.keys(value)
  const props = keys.reduce((p, k, i) => {
    if (remaining > 0) {
      const v = value[k]
      const isLastKey = i === keys.length - 1
      const propStr = getPropStr(context, k, v, remaining, isLastKey)
      remaining -= propStr.length
      p.push(propStr)
    }
    return p
  }, [] as string[])
  // console.log(trim(props.join(', '), length - bracketLen))
  const hasSkippedProps = keys.length > props.length
  const content = hasSkippedProps ? props.join(', ') + ' ' : props.join(', ')
  const trimmedContent = trim(context, content, length - bracketLen)

  return keys.length === 0 ? '{}' :
    trimmedContent.length === 0 ?
      trim(context, `{   }`, length) :
      `{ ${trimmedContent} }`
}

function getPropStr(context: TersifyContext, key: string, value: any, length: number, isLastKey: boolean) {
  const commaAndSpaceLen = isLastKey ? 0 : 2
  const colonAndSpaceLen = 2
  const path = [...context.path, key]
  if (typeof value === 'function') {
    const fnLen = 2
    if ((/^(.*) => /.test(value.toString()))) {
      const propValue = tersifyValue(
        { ...context, path },
        value,
        length - key.length - commaAndSpaceLen - colonAndSpaceLen)
      return `${key}: ${propValue}`
    }
    else {
      const propValue = tersifyValue(
        { ...context, path },
        value,
        length - key.length - commaAndSpaceLen + fnLen)
      const asyncToken = /^async fn/.test(propValue) ? 'async ' : ''
      const generatorToken = /^(async )?fn\*/.test(propValue) ? '*' : ''
      return `${asyncToken}${generatorToken}${key}${propValue.slice(propValue.indexOf('('))}`
    }
  }
  else {
    // console.log(remaining, k.length, colonAndSpaceLen, commaAndSpaceLen, remaining - k.length - colonAndSpaceLen - commaAndSpaceLen)
    const propValue = tersifyValue(
      { ...context, path, noTrim: true },
      value,
      length - key.length - colonAndSpaceLen - commaAndSpaceLen)
    return `${key}: ${propValue}`
  }
}
