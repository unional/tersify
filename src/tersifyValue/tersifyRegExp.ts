import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyRegExp(context: TersifyContext, node: RegExp, length: number) {
  return trim(String(node), length)
}
