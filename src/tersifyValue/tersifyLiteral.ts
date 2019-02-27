import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyLiteral(context: TersifyContext, node: undefined | null | boolean | number, length: number) {
  return trim(context, String(node), length)
}
