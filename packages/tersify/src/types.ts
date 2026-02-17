export type TersifyOptions = {
	maxLength: number
	/**
	 * Raw mode will skip over any .tersify() defined on the object/function.
	 * This ensure the tersify() result can be understand by language (JavaScript) parser.
	 */
	raw?: boolean | undefined
	/**
	 * When `'tab'`, use tab indentation. When a number, use that many spaces per level.
	 * Objects and arrays are formatted with newlines and the chosen indentation.
	 */
	indent?: 'tab' | number
}

export type Tersible<T = unknown> = T & {
	tersify(this: T, options?: Partial<TersifyOptions>): string
}
