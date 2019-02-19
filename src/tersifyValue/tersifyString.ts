import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyString(context: TersifyContext, value: string, length: number) {
  return trim(`'${value}'`, length)
}
