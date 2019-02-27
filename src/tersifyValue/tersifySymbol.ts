import { TersifyContext } from './interfaces';
import { trim } from './trim';

export function tersifySymbol(context: TersifyContext, node: symbol, length: number) {
  if (context.raw) return node.toString()
  return trim(context, node.toString().replace('Symbol(', 'Sym('), length)
}
