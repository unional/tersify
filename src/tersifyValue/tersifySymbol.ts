import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifySymbol(context: TersifyContext, node: symbol, length: number) {
  return trim(node.toString().replace('Symbol(', 'Sym('), length)
}
