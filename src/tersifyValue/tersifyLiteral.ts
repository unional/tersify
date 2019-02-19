import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyLiteral(context: TersifyContext, node: undefined | null, length: number) {
  return trim(String(node), length)
}
