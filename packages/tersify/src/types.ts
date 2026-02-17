export type TersifyOptions = {
	maxLength: number
	/**
	 * Raw mode will skip over any .tersify() defined on the object/function.
	 * This ensure the tersify() result can be understand by language (JavaScript) parser.
	 */
	raw?: boolean | undefined
	/**
	 * When `'tab'`, output objects and arrays with newlines and tab indentation.
	 */
	indent?: 'tab' | undefined
}

export type Tersible<T = unknown> = T & {
	tersify(this: T, options?: Partial<TersifyOptions>): string
}
