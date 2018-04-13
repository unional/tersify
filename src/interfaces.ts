
export interface TersifyOptions {
  maxLength: number,
  /**
   * Raw mode will skip over any .tersify() defined on the object/function.
   * This ensure the tersify() result can be understand by language (JavaScript) parser.
   */
  raw?: boolean
}
