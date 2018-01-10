import { tersify } from './tersify'

/**
 * `stringify-object` doesn't stringify Error instance.
 * It returns `{}`.
 * I need to tersifyError myself.
 */
export function tersifyError(err: Error, option = { maxLength: Infinity }) {
  return tersify({ ...err, message: err.message }, option)
}
