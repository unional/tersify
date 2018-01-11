import { tersify } from './tersify'

/**
 * `stringify-object` doesn't stringify Error instance.
 * It returns `{}`.
 * I need to tersifyError myself.
 */
export function tersifyError(err: Error, option) {
  return tersify({ ...err, message: err.message }, option)
}
