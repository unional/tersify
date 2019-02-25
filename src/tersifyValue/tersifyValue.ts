import { TersifyContext } from '.';
import { tersifyFactory } from './tersifyFactory';

export function tersifyValue(context: TersifyContext, value: any, length: number) {
  const valueType = getType(value)
  const func = tersifyFactory[valueType]
  if (!func) throw new Error(`Can't find fn for ${JSON.stringify(value)}`)

  return func(context, value, length)
}


function getType(value: any) {
  if (value === undefined || value === null) {
    return String(value)
  }

  if (value instanceof RegExp) {
    return 'RegExp'
  }

  if (value instanceof Date) {
    return 'Date'
  }

  if (value instanceof Buffer) {
    return 'Buffer'
  }

  if (Array.isArray(value)) {
    return 'Array'
  }

  return typeof value
}
