export type AcornNode =
	| IdentifierNode
	| LiteralNode
	| CallExpressionNode
	| FunctionExpressionNode
	| FunctionDeclarationNode
	| BlockStatementNode
	| ReturnStatementNode
	| AssignmentPatternNode
	| RestElementNode
	| ArrowFunctionExpressionNode
	| MemberExpressionNode
	| ExpressionStatementNode
	| VariableDeclarationNode
	| VariableDeclaratorNode
	| NewExpressionNode
	| BinaryExpressionNode
	| ConditionalExpressionNode
	| UnaryExpressionNode
	| UpdateExpressionNode
	| LogicalExpressionNode
	| IfStatementNode
	| WhileStatementNode
	| DoWhileStatementNode
	| AssignmentExpressionNode
	| ForStatementNode
	| BreakStatementNode
	| LabeledStatementNode
	| ContinueStatementNode
	| SwitchStatementNode
	| SwitchCaseNode
	| ForInStatementNode
	| ForOfStatementNode
	| ObjectExpressionNode
	| PropertyNode
	| YieldExpressionNode
	| AwaitExpressionNode
	| ArrayExpression
	| ThrowStatementNode
	| TryStatementNode
	| CatchClauseNode
	| ThisExpressionNode
	| ClassExpressionNode
	| ClassBodyNode
	| MethodDefinitionNode
	| SpreadElementNode
	| ObjectPatternNode
	| SequenceExpression
	| TemplateLiteral
	| TemplateElement
	| TaggedTemplateExpression
	| ChainExpression
	| MetaProperty

export interface AcornNodeBase {
	start: number
	end: number
}
export interface IdentifierNode extends AcornNodeBase {
	type: 'Identifier'
	name: string
}

export interface LiteralNode extends AcornNodeBase {
	type: 'Literal'
	value: any
	raw: string
}

export interface CallExpressionNode extends AcornNodeBase {
	type: 'CallExpression'
	callee: IdentifierNode | MemberExpressionNode
	arguments: (IdentifierNode | LiteralNode | ThisExpressionNode)[]
	optional?: boolean
}

export interface SymbolForNode extends AcornNodeBase {
	type: 'CallExpression'
	callee: IdentifierNode
	arguments: [LiteralNode]
}

export interface FunctionExpressionNode extends AcornNodeBase {
	type: 'FunctionExpression'
	id: null | IdentifierNode
	expression: boolean
	generator: boolean
	async: boolean
	params: IdentifierNode[]
	body: AcornNode
}

export interface FunctionDeclarationNode extends AcornNodeBase {
	type: 'FunctionDeclaration'
	id: null | IdentifierNode
	expression: boolean
	generator: boolean
	async: boolean
	params: IdentifierNode[]
	body: AcornNode
}

export interface BlockStatementNode extends AcornNodeBase {
	type: 'BlockStatement'
	body: AcornNode[]
}

export interface ReturnStatementNode extends AcornNodeBase {
	type: 'ReturnStatement'
	argument:
		| LiteralNode
		| IdentifierNode
		| CallExpressionNode
		| MemberExpressionNode
		| ObjectExpressionNode
		| null
}

export interface AssignmentPatternNode extends AcornNodeBase {
	type: 'AssignmentPattern'
	left: IdentifierNode
	right: AcornNode
}

export interface RestElementNode extends AcornNodeBase {
	type: 'RestElement'
	argument: IdentifierNode
}

export interface ArrowFunctionExpressionNode extends AcornNodeBase {
	type: 'ArrowFunctionExpression'
	id: null
	expression: boolean
	generator: boolean
	async: boolean
	params: Array<IdentifierNode | ObjectPatternNode>
	body: AcornNode
}

export interface ExpressionStatementNode extends AcornNodeBase {
	type: 'ExpressionStatement'
	expression: CallExpressionNode
}

export interface MemberExpressionNode extends AcornNodeBase {
	type: 'MemberExpression'
	computed: boolean
	object: IdentifierNode | MemberExpressionNode
	property: IdentifierNode | LiteralNode
	optional?: boolean
}

export interface VariableDeclarationNode extends AcornNodeBase {
	type: 'VariableDeclaration'
	kind: 'const' | 'let' | 'var'
	declarations: VariableDeclaratorNode[]
}

export interface VariableDeclaratorNode extends AcornNodeBase {
	type: 'VariableDeclarator'
	id: IdentifierNode
	init?: NewExpressionNode
}

export interface NewExpressionNode extends AcornNodeBase {
	type: 'NewExpression'
	callee: IdentifierNode | MemberExpressionNode
	arguments: AcornNode[]
}

export interface BinaryExpressionNode extends AcornNodeBase {
	type: 'BinaryExpression'
	operator: string
	left: AcornNode
	right: AcornNode
	needParen?: boolean
}

export interface ConditionalExpressionNode extends AcornNodeBase {
	type: 'ConditionalExpression'
	test: AcornNode
	consequent: AcornNode
	alternate: AcornNode
}

export interface UnaryExpressionNode extends AcornNodeBase {
	type: 'UnaryExpression'
	operator: string
	prefix: boolean
	argument: AcornNode
}

export interface UpdateExpressionNode extends AcornNodeBase {
	type: 'UpdateExpression'
	operator: string
	prefix: boolean
	argument: AcornNode
}

export interface LogicalExpressionNode extends AcornNodeBase {
	type: 'LogicalExpression'
	operator: string
	left: AcornNode
	right: AcornNode
	needParen?: boolean
}

export interface IfStatementNode extends AcornNodeBase {
	type: 'IfStatement'
	test: AcornNode
	consequent: AcornNode
	alternate: AcornNode
}

export interface WhileStatementNode extends AcornNodeBase {
	type: 'WhileStatement'
	test: AcornNode
	body: AcornNode
}

export interface DoWhileStatementNode extends AcornNodeBase {
	type: 'DoWhileStatement'
	test: AcornNode
	body: AcornNode
}

export interface AssignmentExpressionNode extends AcornNodeBase {
	type: 'AssignmentExpression'
	operator: string
	left: AcornNode
	right: AcornNode
}

export interface ForStatementNode extends AcornNodeBase {
	type: 'ForStatement'
	body: AcornNode
	init: AcornNode
	test: AcornNode
	update: AcornNode
}

export interface BreakStatementNode extends AcornNodeBase {
	type: 'BreakStatement'
	label: null | IdentifierNode
}

export interface LabeledStatementNode extends AcornNodeBase {
	type: 'LabeledStatement'
	label: IdentifierNode
	body: AcornNode
}

export interface ContinueStatementNode extends AcornNodeBase {
	type: 'ContinueStatement'
	label: null | IdentifierNode
}

export interface SwitchStatementNode extends AcornNodeBase {
	type: 'SwitchStatement'
	discriminant: AcornNode
	cases: SwitchCaseNode[]
}

export interface SwitchCaseNode extends AcornNodeBase {
	type: 'SwitchCase'
	test: AcornNode | null
	consequent: AcornNode[]
}

export interface ForInStatementNode extends AcornNodeBase {
	type: 'ForInStatement'
	left: AcornNode
	right: AcornNode
	body: AcornNode
}

export interface ForOfStatementNode extends AcornNodeBase {
	type: 'ForOfStatement'
	left: AcornNode
	right: AcornNode
	body: AcornNode
}

export interface ObjectExpressionNode extends AcornNodeBase {
	type: 'ObjectExpression'
	properties: PropertyNode[]
}

export interface PropertyNode extends AcornNodeBase {
	type: 'Property'
	key: IdentifierNode
	kind: 'init'
	computed: boolean
	method: boolean
	shorthand: boolean
	value: AcornNode
}

export interface YieldExpressionNode extends AcornNodeBase {
	type: 'YieldExpression'
	delegate: boolean
	argument: AcornNode
}

export interface AwaitExpressionNode extends AcornNodeBase {
	type: 'AwaitExpression'
	argument: AcornNode
}

export interface ArrayExpression extends AcornNodeBase {
	type: 'ArrayExpression'
	elements: AcornNode[]
}

export interface ThrowStatementNode extends AcornNodeBase {
	type: 'ThrowStatement'
	argument: AcornNode
}

export interface TryStatementNode extends AcornNodeBase {
	type: 'TryStatement'
	block: AcornNode
	handler: AcornNode
	finalizer: AcornNode
}

export interface CatchClauseNode extends AcornNodeBase {
	type: 'CatchClause'
	param: IdentifierNode
	body: AcornNode
}

export interface ThisExpressionNode extends AcornNodeBase {
	type: 'ThisExpression'
	start: number
	end: number
}

export interface ClassExpressionNode extends AcornNodeBase {
	type: 'ClassExpression'
	id: null | IdentifierNode
	superClass: null | ClassExpressionNode
	body: AcornNode
}

export interface ClassBodyNode extends AcornNodeBase {
	type: 'ClassBody'
	body: AcornNode[]
}

export interface MethodDefinitionNode extends AcornNodeBase {
	type: 'MethodDefinition'
	kind: 'constructor'
	static: boolean
	computed: boolean
	key: IdentifierNode
	value: FunctionExpressionNode
}

export interface SpreadElementNode extends AcornNodeBase {
	type: 'SpreadElement'
	argument: IdentifierNode
}

export interface ObjectPatternNode extends AcornNodeBase {
	type: 'ObjectPattern'
	properties: PropertyNode[]
}

export interface SequenceExpression extends AcornNodeBase {
	type: 'SequenceExpression'
	expressions: AcornNode[]
}

export interface TemplateLiteral extends AcornNodeBase {
	type: 'TemplateLiteral'
	expressions: AcornNode[]
	quasis: TemplateElement[]
}

export interface TemplateElement extends AcornNodeBase {
	type: 'TemplateElement'
	value: { raw: string; cooked: string }
	tail: boolean
}

export interface TaggedTemplateExpression extends AcornNodeBase {
	type: 'TaggedTemplateExpression'
	tag: IdentifierNode
	quasi: TemplateLiteral
}

export interface ChainExpression extends AcornNodeBase {
	type: 'ChainExpression'
	expression: MemberExpressionNode | CallExpressionNode
}

export interface MetaProperty extends AcornNodeBase {
	type: 'MetaProperty'
	meta: IdentifierNode
	property: IdentifierNode
}
