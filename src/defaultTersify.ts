import { tersify, TersifyOptions } from './tersify'

export function defaultTersify(options: Partial<TersifyOptions>) {
  return tersify(this, options)
}
