import type { Plugin } from 'rolldown'
import { defineConfig } from 'tsdown'

// Workaround for https://github.com/rolldown/tsdown/issues/958
// rolldown emits `type X = ...` + trailing `export { X }` instead of `export type X = ...`.
// TypeScript 5.x treats these differently for TS2742 inference portability.
// This plugin rewrites trailing-export DTS files back to inline-export form.
function inlineTypeExports(): Plugin {
	return {
		name: 'inline-type-exports',
		generateBundle(_, bundle) {
			for (const file of Object.values(bundle)) {
				const isDts = /\.d\.(m|c)?ts$/.test((file as any).fileName ?? '')
				if (!isDts) continue
				if (file.type === 'asset' && typeof file.source === 'string') {
					file.source = hoistExports(file.source)
				} else if (file.type === 'chunk') {
					file.code = hoistExports(file.code)
				}
			}
		}
	}
}

function escRe(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasLocalDecl(code: string, name: string): boolean {
	const e = escRe(name)
	return (
		new RegExp(`^type ${e}\\b`, 'm').test(code) ||
		new RegExp(`^interface ${e}\\b`, 'm').test(code) ||
		new RegExp(`^declare (?:(?:abstract )?class|function|const|let|var|enum) ${e}\\b`, 'm').test(code)
	)
}

function hoistExports(code: string): string {
	const match = code.match(/^export(?:\s+type)?\s*\{([^}]+)\};?$/m)
	if (!match) return code

	const names = match[1]
		.split(',')
		.map(n => n.trim().replace(/^type\s+/, ''))
		.filter(Boolean)

	const toInline = names.filter(n => hasLocalDecl(code, n))
	if (toInline.length === 0) return code

	let out = code
	for (const name of toInline) {
		const e = escRe(name)
		out = out.replace(new RegExp(`^(type ${e}\\b)`, 'm'), 'export $1')
		out = out.replace(new RegExp(`^(interface ${e}\\b)`, 'm'), 'export $1')
		out = out.replace(
			new RegExp(`^(declare (?:(?:abstract )?class|function|const|let|var|enum) ${e}\\b)`, 'm'),
			'export $1'
		)
	}

	const remaining = names.filter(n => !toInline.includes(n))
	if (remaining.length === 0) {
		out = out.replace(/^export(?:\s+type)?\s*\{[^}]+\};?\s*$/m, '')
	} else {
		out = out.replace(/^export(?:\s+type)?\s*\{[^}]+\};?$/m, `export { ${remaining.join(', ')} };`)
	}

	return out
}

const sharedPlugins = [inlineTypeExports()]

export default defineConfig([
	{
		entry: ['src/index.ts', 'src/constants.browser.ts', 'src/tersifyFunction.browser.ts'],
		format: 'esm',
		outDir: 'esm',
		clean: true,
		dts: true,
		sourcemap: true,
		unbundle: true,
		plugins: sharedPlugins
	},
	{
		entry: ['src/index.ts', 'src/constants.browser.ts', 'src/tersifyFunction.browser.ts'],
		format: 'cjs',
		outDir: 'cjs',
		clean: true,
		dts: true,
		sourcemap: true,
		unbundle: true,
		plugins: sharedPlugins
	}
])
