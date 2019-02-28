import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyError(context: TersifyContext, node: Error, length: number) {
  // 7 = length of `Error()`
  const trimmedMsg = trim(context, `'${node.message}'`, length - 7)
  if (!node.message) return trim(context, `Error()`, length)

  if (trimmedMsg.length === 0) return trim(context, `Error( )`, length)
  return trim(context, `Error(${trimmedMsg})`, length)
}
