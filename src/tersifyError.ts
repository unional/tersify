import { tersifyAny } from './tersifyAny'

/**
 * `stringify-object` doesn't stringify Error instance.
 * It returns `{}`.
 * I need to tersifyError myself.
 */
export function tersifyError(err: Error, option) {
  return tersifyAny({ ...err, message: err.message }, option)
}
