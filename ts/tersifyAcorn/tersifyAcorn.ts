import { parseExpressionAt } from 'acorn'
import { trim } from '../trim.js'
import { TersifyContext } from '../typesInternal.js'
import {
	AcornNode,
	ArrayExpression,
	ArrowFunctionExpressionNode,
	AssignmentExpressionNode,
	AssignmentPatternNode,
	AwaitExpressionNode,
	BinaryExpressionNode,
	BlockStatementNode,
	BreakStatementNode,
	CallExpressionNode,
	CatchClauseNode,
	ChainExpression,
	ClassBodyNode,
	ClassExpressionNode,
	ConditionalExpressionNode,
	ContinueStatementNode,
	DoWhileStatementNode,
	ExpressionStatementNode,
	ForInStatementNode,
	ForOfStatementNode,
	ForStatementNode,
	FunctionDeclarationNode,
	FunctionExpressionNode,
	IdentifierNode,
	IfStatementNode,
	LabeledStatementNode,
	LiteralNode,
	LogicalExpressionNode,
	MemberExpressionNode,
	MethodDefinitionNode,
	NewExpressionNode,
	ObjectExpressionNode,
	ObjectPatternNode,
	PropertyNode,
	RestElementNode,
	ReturnStatementNode,
	SequenceExpression,
	SpreadElementNode,
	SwitchCaseNode,
	SwitchStatementNode,
	SymbolForNode,
	TaggedTemplateExpression,
	TemplateLiteral,
	ThisExpressionNode,
	ThrowStatementNode,
	TryStatementNode,
	UnaryExpressionNode,
	UpdateExpressionNode,
	VariableDeclarationNode,
	VariableDeclaratorNode,
	WhileStatementNode,
	YieldExpressionNode,
	MetaProperty,
	SuperNode
} from './AcornTypes.js'
import { isHigherOperatorOrder } from './isHigherBinaryOperatorOrder.js'

export function tersifyAcorn(context: TersifyContext, value: any, length: number): string {
	const rawString = getFunctionString(value)
	const node = parseExpressionAt(`(${rawString})`, 0, { ecmaVersion: 2020 }) as AcornNode
	const result = tersifyAcornNode({ ...context, rawString }, node, length)
	return result
}

type TersifyAcornContext = TersifyContext & { rawString: string }

function getFunctionString(value: Function) {
	const fnStr = value.toString()
	const isAsync = fnStr.startsWith('async ')
	const subject = isAsync ? fnStr.slice('async '.length) : fnStr
	const matches = /^([^\s\\)]+)\s?\(/.exec(subject)
	return matches && matches[1] !== 'function' && matches[1] !== 'function*'
		? `${isAsync ? 'async ' : ''}function ${fnStr}`
		: fnStr
}

function tersifyAcornNode(context: TersifyAcornContext, node: AcornNode | null, length: number): string {
	if (!node) return ''
	switch (node.type) {
		case 'Identifier':
			return tersifyIdentifierNode(context, node, length)
		case 'Literal':
			return tersifyLiteralNode(context, node, length)
		case 'AssignmentPattern':
			return tersifyAssignmentPatternNode(context, node, length)
		case 'RestElement':
		case 'SpreadElement':
			return tersifyRestElementNode(context, node, length)
		case 'ArrowFunctionExpression':
			return tersifyArrowExpressionNode(context, node, length)
		case 'ExpressionStatement':
			return tersifyExpressionStatementNode(context, node, length)
		case 'CallExpression':
			return tersifyCallExpressionNode(context, node, length)
		case 'MemberExpression':
			return tersifyMemberExpressionNode(context, node, length)
		case 'FunctionDeclaration':
		case 'FunctionExpression':
			return tersifyFunctionExpressionNode(context, node, length)
		case 'BlockStatement':
		case 'ClassBody':
			return tersifyBlockStatementNode(context, node, length)
		case 'ReturnStatement':
			return tersifyReturnStatementNode(context, node, length)
		case 'VariableDeclaration':
			return tersifyVariableDeclarationNode(context, node, length)
		case 'VariableDeclarator':
			return tersifyVariableDeclaratorNode(context, node, length)
		case 'NewExpression':
			return tersifyNewExpressionNode(context, node, length)
		case 'BinaryExpression':
		case 'LogicalExpression':
			return tersifyBinaryExpressionNode(context, node, length)
		case 'ConditionalExpression':
			return tersifyConditionalExpressionNode(context, node, length)
		case 'UnaryExpression':
			return tersifyUnaryExpressionNode(context, node, length)
		case 'UpdateExpression':
			return tersifyUpdateExpressionNode(context, node, length)
		case 'IfStatement':
			return tersifyIfStatementNode(context, node, length)
		case 'WhileStatement':
			return tersifyWhileStatementNode(context, node, length)
		case 'AssignmentExpression':
			return tersifyAssignmentExpressionNode(context, node, length)
		case 'DoWhileStatement':
			return tersifyDoWhileStatementNode(context, node, length)
		case 'ForStatement':
			return tersifyForStatementNode(context, node, length)
		case 'BreakStatement':
			return tersifyBreakStatementNode(context, node, length)
		case 'LabeledStatement':
			return tersifyLabeledStatementNode(context, node, length)
		case 'ContinueStatement':
			return tersifyContinueStatementNode(context, node, length)
		case 'SwitchStatement':
			return tersifySwitchStatementNode(context, node, length)
		case 'SwitchCase':
			return tersifySwitchCaseNode(context, node, length)
		case 'ForInStatement':
			return tersifyForInStatementNode(context, node, length)
		case 'ForOfStatement':
			return tersifyForOfStatementNode(context, node, length)
		case 'ObjectExpression':
			return tersifyObjectExpressionNode(context, node, length)
		case 'Property':
			return tersifyPropertyNode(context, node, length)
		case 'YieldExpression':
			return tersifyYieldExpressionNode(context, node, length)
		case 'AwaitExpression':
			return tersifyAwaitExpressionNode(context, node, length)
		case 'ArrayExpression':
			return tersifyArrayExpressionNode(context, node, length)
		case 'ThrowStatement':
			return tersifyThrowStatementNode(context, node, length)
		case 'TryStatement':
			return tersifyTryStatementNode(context, node, length)
		case 'CatchClause':
			return tersifyCatchClauseNode(context, node, length)
		case 'ThisExpression':
			return tersifyThisExpression(context, node, length)
		case 'ClassExpression':
			return tersifyClassExpression(context, node, length)
		case 'MethodDefinition':
			return tersifyMethodDefinition(context, node, length)
		case 'ObjectPattern':
			return tersifyObjectPattern(context, node, length)
		case 'SequenceExpression':
			return tersifySequenceExpression(context, node, length)
		case 'TemplateLiteral':
			return tersifyTemplateLiteral(context, node, length)
		case 'TaggedTemplateExpression':
			return tersifyTaggedTemplateExpression(context, node, length)
		case 'ChainExpression':
			return tersifyChainExpression(context, node, length)
		case 'MetaProperty':
			return tersifyMetaProperty(context, node, length)
		case 'Super':
			return tersifySuperNode(context, node, length)
		// istanbul ignore next
		default:
			return tersifyUnknown(node, context.rawString)
	}
}

// istanbul ignore next
function tersifyUnknown(node: AcornNode, rawString: string) {
	const nodeType = node.type
	console.warn(`tersify received unsupported type: ${nodeType}. Please open an issue at https://github.com/unional/tersify/issues
node detail:
${JSON.stringify(node, undefined, 2)}

subject:
${rawString}`)
	return `<unsupported: ${nodeType}>`
}

function tersifyCatchClauseNode(context: TersifyAcornContext, node: CatchClauseNode, length: number) {
	const param = tersifyAcornNode(context, node.param, length)
	const body = tersifyAcornNode(context, node.body, length)
	return `catch${param ? ` (${param})` : ''}${body ? ` ${body}` : ''}`
}

function tersifyTryStatementNode(context: TersifyAcornContext, node: TryStatementNode, length: number) {
	const block = tersifyAcornNode(context, node.block, length)
	const handler = tersifyAcornNode(context, node.handler, length)
	const finalizer = tersifyAcornNode(context, node.finalizer, length)

	return `try ${block}${handler ? ` ${handler}` : ''}${finalizer ? ` finally ${finalizer}` : ''}`
}

function tersifyThrowStatementNode(context: TersifyAcornContext, node: ThrowStatementNode, length: number) {
	return `throw ${tersifyAcornNode(context, node.argument, length)}`
}

function tersifyArrayExpressionNode(context: TersifyAcornContext, node: ArrayExpression, length: number) {
	const elements = node.elements.map(e => tersifyAcornNode(context, e, length))
	return trim(context, `[${elements.join(', ')}]`, length)
}

function tersifyAwaitExpressionNode(context: TersifyAcornContext, node: AwaitExpressionNode, length: number) {
	return `await ${tersifyAcornNode(context, node.argument, length)}`
}

function tersifyYieldExpressionNode(context: TersifyAcornContext, node: YieldExpressionNode, length: number) {
	const argument = tersifyAcornNode(context, node.argument, length)
	return `yield ${argument}`
}
function tersifyMetaProperty(context: TersifyAcornContext, node: MetaProperty, length: number) {
	const meta = tersifyAcornNode(context, node.meta, length)
	return `${meta}.${tersifyAcornNode(context, node.property, length)}`
}

function tersifyPropertyNode(context: TersifyAcornContext, node: PropertyNode, length: number) {
	const key = tersifyAcornNode(context, node.key, length)
	const valueNode = node.value
	if (valueNode.type === 'FunctionExpression') {
		const async = valueNode.async ? 'async ' : ''
		const generator = valueNode.generator ? '*' : ''
		const params = tersifyFunctionParams(context, valueNode.params)
		const body = tersifyFunctionBody(context, valueNode.body)
		return `${async}${generator}${key}${params} ${body}`
	}

	if (valueNode.type === 'AssignmentPattern') {
		return tersifyAcornNode(context, valueNode, length)
	}

	const value = tersifyAcornNode(context, valueNode, length)
	if (node.computed) {
		return `[${key}]: ${value}`
	}

	if (key === value) {
		return key
	}

	return `${key}: ${value}`
}

function tersifyObjectExpressionNode(context: TersifyAcornContext, node: ObjectExpressionNode, length: number) {
	const properties = node.properties.map(p => tersifyAcornNode(context, p, length))
	return `{ ${properties.join(', ')} }`
}

function tersifyForOfStatementNode(context: TersifyAcornContext, node: ForOfStatementNode, length: number) {
	const left = tersifyAcornNode(context, node.left, length)
	const right = tersifyAcornNode(context, node.right, length)
	const body = tersifyAcornNode(context, node.body, length)
	return `for (${left} of ${right}) ${body}`
}

function tersifyForInStatementNode(context: TersifyAcornContext, node: ForInStatementNode, length: number) {
	const left = tersifyAcornNode(context, node.left, length)
	const right = tersifyAcornNode(context, node.right, length)
	const body = tersifyAcornNode(context, node.body, length)
	return `for (${left} in ${right}) ${body}`
}

function tersifySwitchCaseNode(context: TersifyAcornContext, node: SwitchCaseNode, length: number) {
	const test = tersifyAcornNode(context, node.test, length)
	const consequent = node.consequent.map(c => tersifyAcornNode(context, c, length))

	if (node.test) {
		return `case ${test}: ${consequent.join(' ')}`
	} else {
		return `default: ${consequent.join(' ')}`
	}
}

function tersifySwitchStatementNode(context: TersifyAcornContext, node: SwitchStatementNode, length: number) {
	const discriminant = tersifyAcornNode(context, node.discriminant, length)
	const cases = node.cases.map(c => tersifyAcornNode(context, c, length))
	return `switch (${discriminant}) { ${cases.join('; ')} }`
}

function tersifyContinueStatementNode(context: TersifyAcornContext, node: ContinueStatementNode, length: number) {
	const label = tersifyAcornNode(context, node.label, length)
	return label ? `continue ${label}` : 'continue'
}

function tersifyLabeledStatementNode(context: TersifyAcornContext, node: LabeledStatementNode, length: number) {
	const label = tersifyAcornNode(context, node.label, length)
	const body = tersifyAcornNode(context, node.body, length)

	return `${label}: ${body}`
}

function tersifyBreakStatementNode(context: TersifyAcornContext, node: BreakStatementNode, length: number) {
	const label = tersifyAcornNode(context, node.label, length)
	return label ? `break ${label}` : 'break'
}

function tersifyForStatementNode(context: TersifyAcornContext, node: ForStatementNode, length: number) {
	const test = tersifyAcornNode(context, node.test, length)
	const init = tersifyAcornNode(context, node.init, length)
	const update = tersifyAcornNode(context, node.update, length)
	const body = tersifyAcornNode(context, node.body, length)

	return `for (${init};${test ? ` ${test}` : ''};${update ? ` ${update}` : ''}) ${body}`
}

function tersifyAssignmentExpressionNode(
	context: TersifyAcornContext,
	node: AssignmentExpressionNode,
	length: number
) {
	const left = tersifyAcornNode(context, node.left, length)
	const right = tersifyAcornNode(context, node.right, length)
	return `${left} ${node.operator} ${right}`
}

function tersifyWhileStatementNode(context: TersifyAcornContext, node: WhileStatementNode, length: number) {
	const test = tersifyAcornNode(context, node.test, length)
	const body = tersifyAcornNode(context, node.body, length)
	return `while (${test}) ${body}`
}

function tersifyDoWhileStatementNode(context: TersifyAcornContext, node: DoWhileStatementNode, length: number) {
	const test = tersifyAcornNode(context, node.test, length)
	const body = tersifyAcornNode(context, node.body, length)
	if (node.body.type === 'BlockStatement') return `do ${body} while (${test})`
	else return `do ${body}; while (${test})`
}

function tersifyUnaryExpressionNode(context: TersifyAcornContext, node: UnaryExpressionNode, length: number) {
	if (['void', 'typeof'].indexOf(node.operator) !== -1)
		return `${node.operator} ${tersifyAcornNode(context, node.argument, length)}`
	return node.prefix
		? `${node.operator}${tersifyAcornNode(context, node.argument, length)}`
		: `${tersifyAcornNode(context, node.argument, length)}${node.operator}`
}
function tersifyUpdateExpressionNode(context: TersifyAcornContext, node: UpdateExpressionNode, length: number) {
	return node.prefix
		? `${node.operator}${tersifyAcornNode(context, node.argument, length)}`
		: `${tersifyAcornNode(context, node.argument, length)}${node.operator}`
}

function tersifyConditionalExpressionNode(
	context: TersifyAcornContext,
	node: ConditionalExpressionNode,
	length: number
) {
	const test = tersifyAcornNode(context, node.test, length)
	const consequent = tersifyAcornNode(context, node.consequent, length)
	const alternate = tersifyAcornNode(context, node.alternate, length)
	return `${test} ? ${consequent} : ${alternate}`
}

function tersifyIfStatementNode(context: TersifyAcornContext, node: IfStatementNode, length: number) {
	const test = tersifyAcornNode(context, node.test, length)
	const consequent = tersifyAcornNode(context, node.consequent, length)
	const alternate = tersifyAcornNode(context, node.alternate, length)
	if (alternate) {
		if (node.consequent.type !== 'BlockStatement') {
			return `if (${test}) ${consequent}; else ${alternate}`
		} else {
			return `if (${test}) ${consequent} else ${alternate}`
		}
	} else return `if (${test}) ${consequent}`
}

function tersifyBinaryExpressionNode(
	context: TersifyAcornContext,
	node: BinaryExpressionNode | LogicalExpressionNode,
	length: number
) {
	if (
		(node.left.type === 'BinaryExpression' || node.left.type === 'LogicalExpression') &&
		isHigherOperatorOrder(node.operator, node.left.operator)
	) {
		node.left.needParen = true
	}
	const left = tersifyAcornNode(context, node.left, length)

	if (
		(node.right.type === 'BinaryExpression' || node.right.type === 'LogicalExpression') &&
		isHigherOperatorOrder(node.operator, node.right.operator)
	) {
		node.right.needParen = true
	}
	const right = tersifyAcornNode(context, node.right, length)

	return node.needParen ? `(${left} ${node.operator} ${right})` : `${left} ${node.operator} ${right}`
}

function tersifyNewExpressionNode(context: TersifyAcornContext, node: NewExpressionNode, length: number) {
	return (
		tersifyNewDate(node) ||
		`new ${tersifyAcornNode(context, node.callee, length)}(${node.arguments
			.map(a => tersifyAcornNode(context, a, length))
			.join(', ')})`
	)
}

function tersifyNewDate(node: NewExpressionNode) {
	if (node.callee.type === 'Identifier' && node.callee.name === 'Date') {
		const args = node.arguments
		if (args.length > 0) {
			const hasNotLiteralArgs = args.some(a => a.type !== 'Literal')
			if (!hasNotLiteralArgs) {
				const literalArgs: LiteralNode[] = args as any
				if (literalArgs.length === 1) {
					const arg = literalArgs[0]
					if (typeof arg.value === 'string') {
						const date = new Date(arg.value)
						return date.toISOString()
					}
				}

				// Assuming all arguments are numbers
				const dateArgs: [number] = literalArgs.map(a => a.value) as any
				const date = new Date(...dateArgs)
				return date.toISOString()
			}
		}
	}
}

function tersifyVariableDeclaratorNode(
	context: TersifyAcornContext,
	node: VariableDeclaratorNode,
	length: number
) {
	return `${node.id.name}${node.init ? ` = ${tersifyAcornNode(context, node.init, length)}` : ''}`
}

function tersifyVariableDeclarationNode(
	context: TersifyAcornContext,
	node: VariableDeclarationNode,
	length: number
) {
	return `${node.kind} ${node.declarations.map(d => tersifyAcornNode(context, d, length)).join(', ')}`
}

function tersifyIdentifierNode(context: TersifyAcornContext, node: IdentifierNode, _length: number) {
	return node.name === 'Symbol' ? 'Sym' : node.name
}

function tersifyLiteralNode(context: TersifyAcornContext, node: LiteralNode, _length: number) {
	return node.raw
}

function tersifyRestElementNode(
	context: TersifyAcornContext,
	node: RestElementNode | SpreadElementNode,
	_length: number
) {
	return `...${node.argument.name}`
}

function tersifyAssignmentPatternNode(context: TersifyAcornContext, node: AssignmentPatternNode, length: number) {
	const eq = ' = '
	return `${node.left.name}${eq}${tersifyAcornNode(
		context,
		node.right,
		length - node.left.name.length - eq.length
	)}`
}

function tersifyArrowExpressionNode(
	context: TersifyAcornContext,
	node: ArrowFunctionExpressionNode,
	length: number
) {
	const async = node.async ? 'async ' : ''
	const generator = node.generator ? '*' : ''
	const arrow = ` => `
	const skipParamParen = node.params.length === 1 && node.params[0].type !== 'ObjectPattern'

	const paramsBody = tersifyParamsBody(context, node.params)
	const params = skipParamParen ? paramsBody : `(${paramsBody})`
	const singleBodyNode = getSingleStatementBodyNode(context, node.body)
	let body = singleBodyNode
		? tersifyArrowBodyAsSingleStatement(context, singleBodyNode)
		: tersifyFunctionBody(context, node.body)

	const isSingleBodyObjectExpression = singleBodyNode && singleBodyNode.type === 'ObjectExpression'
	if (isSingleBodyObjectExpression) {
		body = `(${body})`
	}

	if (async.length + generator.length + params.length + arrow.length + body.length <= length) {
		return `${async}${generator}${params}${arrow}${body}`
	} else {
		const lenAvailForParams = Math.max(
			skipParamParen ? 1 : 3,
			length - (async.length + generator.length + arrow.length + body.length)
		)
		const trimmedParams = skipParamParen
			? trim(context, paramsBody, lenAvailForParams)
			: `(${trim(context, paramsBody, lenAvailForParams - 2)})`
		if (async.length + generator.length + lenAvailForParams + arrow.length + body.length <= length) {
			return `${async}${generator}${trimmedParams}${arrow}${body}`
		} else {
			const minBodyLen = 3
			const wrapLen = isSingleBodyObjectExpression ? `({  })`.length : singleBodyNode ? 0 : `{  }`.length
			const lenAvailForBody = Math.max(
				minBodyLen,
				length - (async.length + generator.length + trimmedParams.length + arrow.length + wrapLen)
			)
			const trimmedBody = isSingleBodyObjectExpression
				? `({ ${trim(context, body.slice(2, body.length - 2), lenAvailForBody - 4)} })`
				: singleBodyNode
					? trim(context, body, lenAvailForBody)
					: `{ ${trim(context, body.slice(2, body.length - 1), lenAvailForBody)} }`

			return trim(context, `${async}${generator}${trimmedParams}${arrow}${trimmedBody}`, length)
		}
	}
}

function getSingleStatementBodyNode(context: TersifyAcornContext, node: AcornNode) {
	if (node.type !== 'BlockStatement') return node
	if (node.body.length === 1 && node.body[0].type === 'ReturnStatement') return node.body[0]
	return undefined
}

function tersifyArrowBodyAsSingleStatement(context: TersifyAcornContext, node: AcornNode) {
	if (node.type === 'ReturnStatement') {
		if (!node.argument) return `{}`

		if (node.argument.type === 'ObjectExpression') {
			return `(${tersifyAcornNode(context, node.argument, Infinity)})`
		}
		return tersifyAcornNode(context, node.argument, Infinity)
	}
	return tersifyAcornNode(context, node, Infinity)
}

function tersifyExpressionStatementNode(
	context: TersifyAcornContext,
	node: ExpressionStatementNode,
	length: number
) {
	return tersifyAcornNode(context, node.expression, length)
}

function tersifyMemberExpressionNode(context: TersifyAcornContext, node: MemberExpressionNode, length: number) {
	const property =
		node.property.type === 'Identifier'
			? tersifyAcornNode(context, node.property, length)
			: `[${tersifyAcornNode(context, node.property, length)}]`
	return `${tersifyAcornNode(context, node.object, length)}${node.optional ? '?' : ''}.${property}`
}

function tersifyCallExpressionNode(context: TersifyAcornContext, node: CallExpressionNode, length: number) {
	if (isSymbolForNode(node)) {
		return `Sym(${node.arguments[0].value})`
	}
	if (isDefineThisProperty(node)) {
		const prop = (node.arguments[1] as LiteralNode).value
		return `this.${prop} = ${tersifyAcornNode(context, node.arguments[2], length - 5 - prop.length - 3)}`
	}
	const callee = tersifyAcornNode(context, node.callee, length)
	const params = tersifyFunctionParams(context, node.arguments)
	return `${callee}${node.optional ? '?.' : ''}${params}`
}

function isSymbolForNode(node: CallExpressionNode): node is SymbolForNode {
	return (
		node.callee.type === 'MemberExpression' &&
		node.callee.object.type === 'Identifier' &&
		node.callee.object.name === 'Symbol' &&
		node.callee.property.type === 'Identifier' &&
		node.callee.property.name === 'for'
	)
}

function isDefineThisProperty(node: CallExpressionNode) {
	return (
		node.callee.type === 'Identifier' &&
		node.callee.name === '_defineProperty' &&
		node.arguments.length === 3 &&
		node.arguments[0].type === 'ThisExpression'
	)
}

function tersifyParamsBody(
	context: TersifyAcornContext,
	params: Array<IdentifierNode | LiteralNode | ObjectPatternNode | ThisExpressionNode>
) {
	return params
		.reduce((p, v) => {
			p.push(tersifyAcornNode(context, v, Infinity))
			return p
		}, [] as string[])
		.join(', ')
}

function tersifyFunctionExpressionNode(
	context: TersifyAcornContext,
	node: FunctionExpressionNode | FunctionDeclarationNode,
	length: number
) {
	const token = context.raw ? `function` : 'fn'
	const async = node.async ? 'async ' : ''
	const generator = node.generator ? '*' : ''
	const id = node.id ? ` ${node.id.name}` : ''
	const params = node.params.length > 0 ? tersifyFunctionParams(context, node.params) : '()'
	const space = ' '
	const declarationLen = async.length + token.length + generator.length + id.length + space.length

	const paramsContent = params.slice(1, params.length - 1)
	const minParam = paramsContent.length > 3 ? `(${trim(context, paramsContent, 3)})` : params
	const minPrebodyLen = declarationLen + minParam.length
	const prebodyLen = declarationLen + params.length
	const body = tersifyFunctionBody(context, node.body)

	if (minPrebodyLen + body.length > length) {
		// 5 = length of `{ . }` to indicate there are something in the body
		if (minPrebodyLen + 5 > length) {
			return trim(context, `${async}${token}${generator}${id}${minParam}${space}${body}`, length)
		} else {
			const bodyContent = body.slice(2, body.length - 2)
			const result = `${async}${token}${generator}${id}${minParam}${space}${bodyContent.length === 0 ? '{}' : `{ ${trim(context, bodyContent, length - minPrebodyLen - 4)} }`
				}`
			return result.length > length ? trim(context, result, length) : result
		}
	} else if (prebodyLen + body.length > length) {
		if (minPrebodyLen + body.length < length) {
			return `${async}${token}${generator}${id}(${trim(
				context,
				paramsContent,
				length - body.length - declarationLen - 2
			)})${space}${body}`
		}
		return trim(context, `${async}${token}${generator}${id}${minParam}${space}${body}`, length)
	} else {
		return trim(context, `${async}${token}${generator}${id}${params}${space}${body}`, length)
	}
}

function tersifyFunctionParams(
	context: TersifyAcornContext,
	params: (IdentifierNode | LiteralNode | ObjectPatternNode | ThisExpressionNode)[]
) {
	return `(${tersifyParamsBody(context, params)})`
}

function tersifyFunctionBody(context: TersifyAcornContext, value: AcornNode) {
	return tersifyAcornNode(context, value, Infinity)
}

function tersifyBlockStatementNode(
	context: TersifyAcornContext,
	node: BlockStatementNode | ClassBodyNode,
	length: number
) {
	if (length <= 3 && node.body.length > 0) return trim(context, '...', length)
	if (length <= 4 && node.body.length > 0) return trim(context, '{...', length)
	const bracketAndSpaceLength = 4
	let bodyLen = length - bracketAndSpaceLength
	const statements: string[] = []
	node.body.forEach(n => {
		if (bodyLen) {
			const s = tersifyAcornNode(context, n, bodyLen)
			bodyLen -= s.length
			if (s && s !== 'return') statements.push(s)
		}
	})
	const body = statements.join('; ')
	const result = `{${body ? ` ${body} ` : ''}}`

	return result
}

function tersifyReturnStatementNode(context: TersifyAcornContext, node: ReturnStatementNode, length: number) {
	if (!node.argument) return 'return'
	return `return ${tersifyAcornNode(context, node.argument, length)}`
}

function tersifyThisExpression(_context: TersifyAcornContext, _node: ThisExpressionNode, _length: number) {
	return `this`
}

function tersifyClassExpression(context: TersifyAcornContext, node: ClassExpressionNode, length: number) {
	const classStr = trim(context, `class${node.id ? ` ${node.id.name}` : ' '}{}`, length)
	const prefix = classStr.slice(0, Math.max(3, classStr.length - 2))
	const body = tersifyAcornNode(context, node.body, length - prefix.length)
	return `${prefix}${length >= prefix.length + body.length || body.length > 3
		? body
		: trim(context, '...', length - prefix.length)
		}`
}

function tersifyMethodDefinition(context: TersifyAcornContext, node: MethodDefinitionNode, length: number) {
	const staticStr = node.static ? 'static ' : ''
	const fnExpNode = node.value
	const async = fnExpNode.async ? 'async ' : ''
	const generator = fnExpNode.generator ? '*' : ''
	const id = node.key.name ?? `[${tersifyAcornNode(context, node.key, length)}]`
	const params = fnExpNode.params.length > 0 ? tersifyFunctionParams(context, fnExpNode.params) : '()'
	const space = ' '
	const declarationLen = staticStr.length + async.length + generator.length + id.length + space.length

	const paramsContent = params.slice(1, params.length - 1)
	const minParam = paramsContent.length > 3 ? `(${trim(context, paramsContent, 3)})` : params
	const minPrebodyLen = declarationLen + minParam.length
	const prebodyLen = declarationLen + params.length
	const body = tersifyFunctionBody(context, fnExpNode.body)
	if (minPrebodyLen + body.length > length) {
		// 5 = length of `{ . }` to indicate there are something in the body
		if (minPrebodyLen + 5 > length) {
			return trim(context, `${staticStr}${async}${generator}${id}${minParam}${space}${body}`, length)
		} else {
			const bodyContent = body.slice(2, body.length - 2)
			const result = `${staticStr}${async}${generator}${id}${minParam}${space}${bodyContent.length === 0 ? '{}' : `{ ${trim(context, bodyContent, length - minPrebodyLen - 4)} }`
				}`
			return result.length > length ? trim(context, result, length) : result
		}
	} else if (prebodyLen + body.length > length) {
		if (minPrebodyLen + body.length < length) {
			return `${staticStr}${async}${generator}${id}(${trim(
				context,
				paramsContent,
				length - body.length - declarationLen - 2
			)})${space}${body}`
		}
		return trim(context, `${staticStr}${async}${generator}${id}${minParam}${space}${body}`, length)
	} else {
		return trim(context, `${staticStr}${async}${generator}${id}${params}${space}${body}`, length)
	}
}

function tersifyObjectPattern(context: TersifyAcornContext, node: ObjectPatternNode, length: number) {
	return `${trim(
		context,
		`{ ${node.properties.map(p => tersifyAcornNode(context, p, length)).join(', ')} }`,
		length - 2
	)}`
}

function tersifySequenceExpression(context: TersifyAcornContext, node: SequenceExpression, length: number) {
	return `(${node.expressions.map(n => tersifyAcornNode(context, n, length)).join(', ')})`
}

function tersifyTemplateLiteral(context: TersifyAcornContext, node: TemplateLiteral, length: number) {
	const elements = node.expressions.concat(node.quasis).sort((a, b) => a.start - b.start)
	return (
		'`' +
		elements.reduce((p, e) => {
			if (length <= 0) return p
			if (e.type === 'TemplateElement') {
				length -= e.value.raw.length
				p += e.value.raw
			} else {
				const result = tersifyAcornNode(context, e, length)
				length -= result.length
				p += '${' + result + '}'
			}
			return p
		}, '') +
		'`'
	)
}

function tersifyTaggedTemplateExpression(
	context: TersifyAcornContext,
	node: TaggedTemplateExpression,
	length: number
) {
	const name = node.tag.name
	return name + tersifyAcornNode(context, node.quasi, length - name.length)
}

function tersifyChainExpression(context: TersifyAcornContext, node: ChainExpression, length: number) {
	switch (node.expression.type) {
		case 'MemberExpression':
			return tersifyMemberExpressionNode(context, node.expression, length)
		// return `${tersifyAcornNode(context, node.expression.object, length)}?.${tersifyAcornNode(context, node.expression.property, length)}`
		case 'CallExpression': {
			return tersifyCallExpressionNode(context, node.expression, length)
		}
		// istanbul ignore next
		default:
			return tersifyUnknown(node, context.rawString)
	}
}

function tersifySuperNode(context: TersifyAcornContext, node: SuperNode, length: number) {
	return 'Super'
}
