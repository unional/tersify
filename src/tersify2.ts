import { required } from 'unpartial';
import { defaultOptions } from './constants';
import { TersifyOptions } from './interfaces';
import { TersifyContext, tersifyValue } from './tersifyValue';

export function tersify(obj, options?: Partial<TersifyOptions>): string {
  const context = required<TersifyContext>(defaultOptions, options, { references: [] })
  return tersifyValue(context, obj, context.maxLength)
}
