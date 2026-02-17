import { trim } from './trim.js'
import type { TersifyOptions } from './types.js'

export function tersifyFunctionByString(fn: Function, options: TersifyOptions) {
	const str = fn.toString()
	if (options.raw) return normalizeRawOutput(str)
	const struct = parseFn(str)
	switch (struct.type) {
		case 'function':
			return formatFn2(struct, options.maxLength)
		case 'arrow':
			return formatArrow2(struct, options.maxLength)
		default:
			// istanbul ignore next
			return formatUnknown(struct, options.maxLength)
	}
}

export type FuncStruct = FunctionStruct | ArrowStruct | UnknownStruct

export interface FunctionStruct {
	type: 'function'
	name: string
	params: string
	body: string
	async: boolean
	generator: boolean
}

export interface ArrowStruct {
	type: 'arrow'
	params: string
	body: string
	singleParam: boolean
	singleLineBody: boolean
	async: boolean
}

export interface UnknownStruct {
	type: 'unknown'
	value: string
}

/**
 * Note that we don't have to be exhaustive with the regex.
 * The input is from compilers's `fn.toString()`.
 * So they won't be too bad.
 */
const funcRegex = /^(async\s+)?function\s*(\*?)\s*(\w*)\s*\(([^)]*)\)\s*(\{.*\})$/ms
const arrowRegex = /^(async\s*)?\(([^)]*)\)\s*=>(.*)$/ms
const arrowSingleParamRegex = /^(async\s+)?(\w+)\s*=>(.*)$/ms

export function parseFn(input: string): FuncStruct {
	let match = funcRegex.exec(input)
	if (match) {
		const body = getEnclosedBody((match[5] ?? '').trim()).trim()
		return {
			type: 'function',
			async: !!match[1],
			generator: !!match[2],
			name: (match[3] ?? '').trim(),
			params: (match[4] ?? '').trim(),
			body
		}
	}
	match = arrowRegex.exec(input)
	if (match) {
		const params = (match[2] ?? '').trim()
		let body = (match[3] ?? '').trim()
		let singleLineBody = isSingleLineBody(body)
		body = removeLineBreaks(
			singleLineBody ? getSingleLineBody(body, Number.POSITIVE_INFINITY) : getEnclosedBody(body)
		).trim()
		if (!singleLineBody && body.startsWith('return ') && body.endsWith(';')) {
			singleLineBody = true
			body = body.slice(7, -1)
			if (body.startsWith('{')) {
				body = `(${body})`
			}
		}
		return {
			type: 'arrow',
			async: !!match[1],
			params,
			body,
			singleParam: params.length > 0 && params.indexOf(',') === -1,
			singleLineBody
		}
	}
	match = arrowSingleParamRegex.exec(input)
	if (match) {
		let body = (match[3] ?? '').trim()
		let singleLineBody = isSingleLineBody(body)
		body = removeLineBreaks(
			singleLineBody ? getSingleLineBody(body, Number.POSITIVE_INFINITY) : getEnclosedBody(body)
		).trim()
		if (!singleLineBody && body.startsWith('return ') && body.endsWith(';')) {
			singleLineBody = true
			body = body.slice(7, -1)
			if (body.startsWith('{')) {
				body = `(${body})`
			}
		}
		return {
			type: 'arrow',
			async: !!match[1],
			params: `${match[2]}`,
			body,
			singleParam: true,
			singleLineBody
		}
	}
	return {
		type: 'unknown',
		value: input
	}
}

/**
 * Normalize body string so output is consistent across engines (e.g. jsdom vs Node).
 * Ensures spaces around keywords and removes unwanted semicolons in object/array literals.
 */
function normalizeBody(body: string): string {
	return (
		body
			.replace(/\bfunction\s*\*\s*\(/g, 'function* (')
			.replace(/\bfunction\s*\(/g, 'function (')
			.replace(/\basync\s+function\s*\*\s*\(/g, 'async function* (')
			.replace(/\basync\s+function\s*\(/g, 'async function (')
			.replace(/\)=>/g, ') =>')
			.replace(/=>\s*\{/g, '=> {')
			.replace(/\bwhile\s*\(/g, 'while (')
			.replace(/\bfor\s*\(/g, 'for (')
			.replace(/\bswitch\s*\(/g, 'switch (')
			.replace(/\}\s*while\s*\(/g, '} while (')
			.replace(/(\}\s*while\s*\([^)]+\))\s*\}/g, '$1; }') // do-while: add semicolon before closing }
			.replace(/(\}\s*while\s*\([^)]+\))\s*$/g, '$1;') // do-while at end of body: add semicolon
			.replace(/(while\s*\([^)]+\))\s*$/g, '$1;') // do-while without block at end: add semicolon
			.replace(/\b(while\s*\([^)]+\))(\s*)(\w)/g, (_, cond, space, next) => (space ? _ : `${cond} ${next}`))
			.replace(/\b(for\s*\([^)]+\))(\s*)(\w)/g, (_, cond, space, next) => (space ? _ : `${cond} ${next}`))
			.replace(/\b(switch\s*\([^)]+\))(\s*)(\w)/g, (_, cond, space, next) => (space ? _ : `${cond} ${next}`))
			.replace(/\b(in\s+\w+)\)(\w)/g, '$1) $2')
			.replace(/\b(of\s+\w+)\)(\w)/g, '$1) $2')
			.replace(/\bfinally\s*\{/g, 'finally {')
			.replace(/\bcatch\s*\{/g, 'catch {')
			.replace(/\)\s*\{/g, ') {')
			.replace(
				/(\{\s*|,\s*)((?:async\s+)?)(\*\s*)?(\w+)\s+\(/g,
				(_, prefix, async, star, name) => prefix + async + (star ? '*' : '') + name + '('
			)
			.replace(/\[\s*;/g, '[') // remove erroneous leading semicolon in array (from removeLineBreaks)
			.replace(/\[\s+/g, '[')
			.replace(/\s+\]/g, ']')
			// Normalize for(;;) - collapse space between semicolons (Node vs JSDOM)
			.replace(/;\s+;/g, ';;')
			.replace(/;;\s+\)/g, ';;)')
			.replace(/;\s+\)/g, ';)') // trim space before ) in for(x;y; ) -> for(x;y;)
			// Don't add semicolon after } when next token is return (consistent with Node output)
			.replace(/\}\s*;\s*(?=\s*return\b)/g, '} ')
			// Normalize void 0 to undefined (engine stringifies undefined as void 0)
			.replace(/\bvoid\s+0\b/g, 'undefined')
			// Strip pure annotation comments (bundlers inject these)
			.replace(/\/\*\s*@__PURE__\s*\*\/\s*/g, '')
			// Normalize double-quoted strings to single quotes for consistency
			.replace(
				/"([^"\\]*(\\.[^"\\]*)*)"/g,
				(_, inner, _backref) => "'" + inner.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
			)
	)
}

/** Normalize raw fn.toString() output for consistent formatting across engines. */
function normalizeRawOutput(str: string): string {
	return str.replace(/\)=>/g, ') =>').replace(/=>(\S)/g, '=> $1')
}

/** Normalize double-quoted strings to single quotes (params and short strings). */
function normalizeStringQuotes(str: string): string {
	return str.replace(
		/"([^"\\]*(\\.[^"\\]*)*)"/g,
		(_, inner) => "'" + inner.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
	)
}

function formatFn2(struct: FunctionStruct, maxLength: number) {
	if (struct.params) struct.params = normalizeStringQuotes(struct.params)
	if (struct.body) struct.body = normalizeBody(struct.body)
	const template = `${struct.async ? 'async ' : ''}fn${struct.generator ? '*' : ''}${
		struct.name ? ' ' + struct.name : ''
	}(${struct.params ? '%1' : ''}) {${struct.body ? ' %2 ' : ''}}`
	const baseLength =
		struct.params && struct.body
			? template.length - 4
			: struct.params || struct.body
				? template.length - 2
				: template.length

	struct.params = trim(
		{ raw: false, noTrim: false },
		struct.params,
		Math.max(3, maxLength - baseLength - struct.body.length)
	)
	struct.body = trim(
		{ raw: false, noTrim: false },
		struct.body,
		Math.max(3, maxLength - baseLength - struct.params.length)
	)
	return trim({ raw: false, noTrim: false }, applyTemplate(template, struct), maxLength)
}

function formatArrow2(struct: ArrowStruct, maxLength: number) {
	if (struct.params) struct.params = normalizeStringQuotes(struct.params)
	if (struct.body) struct.body = normalizeBody(struct.body)
	const template = `${struct.async ? 'async ' : ''}${
		struct.singleParam ? '%1' : `(${struct.params ? '%1' : ''})`
	} => ${struct.singleLineBody ? '%2' : `{${struct.body ? ' %2 ' : ''}}`}`
	const baseLength =
		struct.params && struct.body
			? template.length - 4
			: struct.params || struct.body
				? template.length - 2
				: template.length

	struct.params = trim(
		{ raw: false, noTrim: false },
		struct.params,
		Math.max(3, maxLength - baseLength - struct.body.length)
	)
	struct.body = trim(
		{ raw: false, noTrim: false },
		struct.body,
		Math.max(3, maxLength - baseLength - struct.params.length)
	)
	return trim({ raw: false, noTrim: false }, applyTemplate(template, struct), maxLength)
}

// istanbul ignore next
function formatUnknown(struct: UnknownStruct, maxLength: number) {
	return trim({ noTrim: false }, struct.value, maxLength)
}

function isSingleLineBody(str: string) {
	return !str.startsWith('{')
}

function getSingleLineBody(str: string, maxLength: number) {
	const struct = parseFn(str)
	switch (struct.type) {
		case 'function':
			return formatFn2(struct, maxLength)
		case 'arrow':
			return formatArrow2(struct, maxLength)
		default:
			return str
				.replace(/return;/g, '')
				.replace(/([\s([{])Symbol\(\)/g, '$1Sym()')
				.replace(/([\s([{])Symbol\.for\('([\w_]*)'\)/g, '$1Sym($2)')
				.replace(/([\s([{])Symbol\.for\("([\w_]*)"\)/g, '$1Sym($2)')
				.replace(/([\s([{])Symbol\.for\(`([\w_]*)`\)/g, '$1Sym($2)')
				.replace(/{\s+}/g, '{}')
	}
}

function getEnclosedBody(str: string) {
	let count = 1
	str = str.slice(1)
	for (let i = 0; i <= str.length; i++) {
		if (str[i] === '}') count--
		if (str[i] === '{') count++
		if (count === 0) {
			const body = removeLineBreaks(str.slice(0, i))
			str = body
				.replace(/return;/g, '')
				.replace(/([\s([{])Symbol\(\)/g, '$1Sym()')
				.replace(/([\s([{])Symbol\.for\('([\w_]*)'\)/g, '$1Sym($2)')
				.replace(/([\s([{])Symbol\.for\("([\w_]*)"\)/g, '$1Sym($2)')
				.replace(/([\s([{])Symbol\.for\(`([\w_]*)`\)/g, '$1Sym($2)')
				.replace(/{\s+}/g, '{}')
			break
		}
	}
	return str
}

function removeLineBreaks(value: string) {
	return value
		.split('\n')
		.map(x => x.trim())
		.filter(x => !!x)
		.map((x, i, a) => {
			if (i >= a.length - 1) return x
			// Do not add semicolon after line ending with comma (object/array elements) or [
			if (/,\s*$/.test(x) || /\[$/.test(x)) return x
			// Do not add semicolon when next line is closing brace or bracket
			if (/^[}\]]\s*;?\s*$/.test(a[i + 1].trim())) return x
			if (!/[^({}):;(do|else)]$/.test(x)) return x
			if (!/[^)}]/.test(a[i + 1])) return x
			return x + ';'
		})
		.join(' ')
}

function applyTemplate(template: string, struct: { params: string; body: string }) {
	if (struct.params) {
		template = template.replace('%1', struct.params)
	}
	if (struct.body) {
		template = template.replace('%2', struct.body)
	}
	return template
}
