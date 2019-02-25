import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyError(context: TersifyContext, node: Error, length: number) {
  const trimmedMsg = trim(context, node.message, length - 5)
  if (node.message && trimmedMsg.length === 0) return trim(context, `Err( )`, length)

  return trim(context, `Err(${trimmedMsg})`, length)
}
