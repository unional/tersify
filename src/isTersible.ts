import { Tersible } from './types';

export function isTersible<T>(obj: T): obj is Tersible<T> {
  return typeof obj['tersify'] === 'function'
}
