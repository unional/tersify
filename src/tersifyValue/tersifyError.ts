import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyError(context: TersifyContext, node: Error, length: number) {
  const errorName = node.constructor.name
  // 7 = length of `Error()`
  const trimmedMsg = trim(context, `'${node.message}'`, length - 7)
  if (!node.message) return trim(context, `${errorName}()`, length)

  if (trimmedMsg.length === 0) return trim(context, `${errorName}( )`, length)
  return trim(context, `${errorName}(${trimmedMsg})`, length)
}
