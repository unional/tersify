import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'

const mode = process.argv[2]

if (!['tsc', 'tsdown'].includes(mode)) {
	console.error('Usage: node scripts/consumer-smoke.mjs <tsc|tsdown>')
	process.exit(1)
}

const root = resolve(new URL('..', import.meta.url).pathname)
const tempRoot = mkdtempSync(join(tmpdir(), `tersify-smoke-${mode}-`))
const publishDir = join(tempRoot, 'publish')
const consumerDir = join(tempRoot, 'consumer')

run('pnpm', ['exec', 'tsdown'], { cwd: root })

if (mode === 'tsc') {
	run('pnpm', ['exec', 'tsc', '-p', 'tsconfig.smoke-types.json'], { cwd: root })
}

mkdirSync(publishDir, { recursive: true })
copyIfExists(join(root, 'cjs'), join(publishDir, 'cjs'))
copyIfExists(join(root, 'esm'), join(publishDir, 'esm'))
copyIfExists(join(root, 'src'), join(publishDir, 'src'))
copyIfExists(join(root, 'esm-tsc'), join(publishDir, 'esm-tsc'))
copyIfExists(join(root, 'LICENSE'), join(publishDir, 'LICENSE'))
copyIfExists(join(root, 'readme.md'), join(publishDir, 'readme.md'))

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

if (mode === 'tsc') {
	pkg.types = './esm-tsc/index.d.ts'
	pkg.exports['.'].import.types = './esm-tsc/index.d.ts'
	pkg.files = [...new Set([...(pkg.files ?? []), 'esm-tsc'])]
}

writeFileSync(join(publishDir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)

const tarball = runCapture('npm', ['pack'], { cwd: publishDir }).trim().split('\n').pop()
const tarballPath = join(publishDir, tarball)

mkdirSync(consumerDir, { recursive: true })
writeFileSync(
	join(consumerDir, 'package.json'),
	`${JSON.stringify(
		{
			name: `consumer-repro-${mode}`,
			private: true,
			type: 'module'
		},
		null,
		2
	)}\n`
)
writeFileSync(
	join(consumerDir, 'tsconfig.json'),
	`${JSON.stringify(
		{
			compilerOptions: {
				target: 'ES2020',
				module: 'NodeNext',
				moduleResolution: 'NodeNext',
				declaration: true,
				emitDeclarationOnly: true,
				strict: true,
				skipLibCheck: false
			}
		},
		null,
		2
	)}\n`
)
writeFileSync(
	join(consumerDir, 'index.ts'),
	`import { tersible } from 'tersify'

export function foo() {
\treturn tersible((x: any) => !!x)
}
`
)

run('npm', ['install', '--no-package-lock', 'typescript@5.0.2', tarballPath], { cwd: consumerDir })
run('npx', ['tsc'], { cwd: consumerDir })

process.stdout.write(`Smoke test passed for ${mode}\n`)
process.stdout.write(`Artifact: ${basename(tarballPath)}\n`)
process.stdout.write(`Temp dir: ${tempRoot}\n`)

function copyIfExists(from, to) {
	if (!existsSync(from)) return
	cpSync(from, to, { recursive: true })
}

function run(command, args, options) {
	execFileSync(command, args, { stdio: 'inherit', ...options })
}

function runCapture(command, args, options) {
	return execFileSync(command, args, { encoding: 'utf8', ...options })
}

process.on('exit', () => {
	if (process.env.KEEP_TERSIFY_SMOKE_TMP) return
	rmSync(tempRoot, { force: true, recursive: true })
})
