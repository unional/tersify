import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyDate(context: TersifyContext, node: Date, length: number) {
  return trim(context, node.toISOString(), length)
}
