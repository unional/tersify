import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyBuffer(context: TersifyContext, node: any, length: number) {
  return trim(context, node.inspect(), length)
}
