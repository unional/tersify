import { TersifyContext } from './interfaces';
import { isTersible } from '../tersible';
import { tersifyValue } from './tersifyValue';
import { trim } from './trim';
export function tersifyObject(context: TersifyContext, value: object, length: number) {
  // if (context.references.find(x => x === value)) {
  //   return `[circular]`
  // }

  // context.references.push(value)

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
      const commaAndSpaceLen = isLastKey ? 0 : 2
      const fnLen = 2
      const colonAndSpaceLen = 2
      if (typeof v === 'function') {
        if ((/^(.*) => /.test(v.toString()))) {
          const propValue = tersifyValue(
            context,
            v,
            remaining - k.length - commaAndSpaceLen - colonAndSpaceLen)
          const propStr = `${k}: ${propValue.slice(propValue.indexOf('('))}`
          remaining -= propStr.length
          p.push(propStr)
        }
        else {
          const propValue = tersifyValue(
            context,
            v,
            remaining - k.length - commaAndSpaceLen + fnLen)
          const propStr = `${k}${propValue.slice(propValue.indexOf('('))}`
          remaining -= propStr.length
          p.push(propStr)
        }
      }
      else {
        // console.log(remaining, k.length, colonAndSpaceLen, commaAndSpaceLen, remaining - k.length - colonAndSpaceLen - commaAndSpaceLen)
        const propValue = tersifyValue(
          context,
          v,
          remaining - k.length - colonAndSpaceLen - commaAndSpaceLen)
        const propStr = `${k}: ${propValue}`
        remaining -= propStr.length
        p.push(propStr)
      }
    }
    return p
  }, [] as string[])
  // console.log(trim(props.join(', '), length - bracketLen))
  return props.length === 0 ? '{}' : `{ ${trim(props.join(', '), length - bracketLen)} }`
}
