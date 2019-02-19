import { TersifyContext } from '.';
import { tersifyFactory } from './tersifyFactory';


export function tersifyValue(context: TersifyContext, value: any, length: number) {
  const func = getFunc(value)
  if (!func) throw new Error(`Can't find fn for ${JSON.stringify(value)}`)
  return func(context, value, length)
}


function getFunc(value: any) {
  return tersifyFactory[getType(value)]
}

function getType(value: any) {
  if (value === undefined || value === null) {
    return String(value)
  }

  if (value instanceof RegExp) {
    return 'RegExp'
  }

  return typeof value
}
