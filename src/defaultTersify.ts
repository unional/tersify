import { tersify } from './tersify'
import { TersifyOptions } from './interfaces'

export function defaultTersify(options: Partial<TersifyOptions>) {
  return tersify(this, options)
}
