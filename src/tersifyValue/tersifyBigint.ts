import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifyBigint(context: TersifyContext, value: any, length: number) {
  return trim(String(value) + 'n', length)
}
