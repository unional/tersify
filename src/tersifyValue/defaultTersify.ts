import { TersifyOptions } from '../interfaces';
import { tersify } from '../tersify';

export function defaultTersify(this: any, options: Partial<TersifyOptions>) {
  return tersify(this, options)
}
