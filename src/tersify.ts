import { unpartial } from 'unpartial'

import { defaultOptions } from './constants'
import { tersifyAny } from './tersifyAny'
import { TersifyOptions } from './interfaces'

export function tersify(obj, options?: Partial<TersifyOptions>) {
  const opt = unpartial(defaultOptions, options)
  if (typeof obj === 'string') {
    if (obj.length > opt.maxLength)
      return `${obj.slice(0, opt.maxLength - 3)}...`
    return `${obj}`
  }
  return tersifyAny(obj, opt)
}
