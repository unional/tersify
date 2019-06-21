export type AcornNode = IdentifierNode | LiteralNode | CallExpressionNode |
  FunctionExpressionNode | BlockStatementNode | ReturnStatementNode |
  AssignmentPatternNode | RestElementNode | ArrowFunctionExpressionNode |
  MemberExpressionNode | ExpressionStatementNode | VariableDeclarationNode |
  VariableDeclaratorNode | NewExpressionNode | BinaryExpressionNode |
  ConditionalExpressionNode | UnaryExpressionNode | UpdateExpressionNode | LogicalExpressionNode |
  IfStatementNode | WhileStatementNode | DoWhileStatementNode | AssignmentExpressionNode |
  ForStatementNode | BreakStatementNode | LabeledStatementNode | ContinueStatementNode |
  SwitchStatementNode | SwitchCaseNode | ForInStatementNode | ForOfStatementNode |
  ObjectExpressionNode | PropertyNode | YieldExpressionNode | AwaitExpressionNode |
  ArrayExpression | ThrowStatementNode | TryStatementNode | CatchClauseNode |
  ThisExpressionNode

export type AcornNodeBase = {
  start: number,
  end: number
}
export type IdentifierNode = {
  type: 'Identifier',
  name: string
} & AcornNodeBase

export type LiteralNode = {
  type: 'Literal',
  value: any,
  raw: string
} & AcornNodeBase

export type CallExpressionNode = {
  type: 'CallExpression',
  callee: IdentifierNode | MemberExpressionNode,
  arguments: (IdentifierNode | LiteralNode)[]
} & AcornNodeBase

export type SymbolForNode = AcornNodeBase & {
  type: 'CallExpression',
  callee: IdentifierNode,
  arguments: [LiteralNode]
}

export type FunctionExpressionNode = {
  type: 'FunctionExpression',
  id: null | IdentifierNode,
  expression: boolean,
  generator: boolean,
  async: boolean,
  params: IdentifierNode[],
  body: AcornNode
} & AcornNodeBase

export type BlockStatementNode = AcornNodeBase & {
  type: 'BlockStatement',
  body: AcornNode[]
}

export type ReturnStatementNode = AcornNodeBase & {
  type: 'ReturnStatement',
  argument: LiteralNode | IdentifierNode | CallExpressionNode | MemberExpressionNode | ObjectExpressionNode | null
}

export type AssignmentPatternNode = AcornNodeBase & {
  type: 'AssignmentPattern',
  left: IdentifierNode,
  right: AcornNode
}

export type RestElementNode = AcornNodeBase & {
  type: 'RestElement',
  argument: IdentifierNode
}

export type ArrowFunctionExpressionNode = AcornNodeBase & {
  type: 'ArrowFunctionExpression',
  id: null,
  expression: boolean,
  generator: boolean,
  async: boolean,
  params: IdentifierNode[],
  body: AcornNode
}

export type ExpressionStatementNode = AcornNodeBase & {
  type: 'ExpressionStatement',
  expression: CallExpressionNode
}

export type MemberExpressionNode = AcornNodeBase & {
  type: 'MemberExpression',
  computed: boolean,
  object: IdentifierNode | MemberExpressionNode,
  property: IdentifierNode
}

export type VariableDeclarationNode = AcornNodeBase & {
  type: 'VariableDeclaration'
  kind: 'const' | 'let' | 'var',
  declarations: VariableDeclaratorNode[]
}

export type VariableDeclaratorNode = AcornNodeBase & {
  type: 'VariableDeclarator',
  id: IdentifierNode
  init?: NewExpressionNode
}

export type NewExpressionNode = AcornNodeBase & {
  type: 'NewExpression',
  callee: IdentifierNode,
  arguments: AcornNode[]
}

export type BinaryExpressionNode = AcornNodeBase & {
  type: 'BinaryExpression',
  operator: string,
  left: AcornNode,
  right: AcornNode,
  needParen?: boolean
}

export type ConditionalExpressionNode = AcornNodeBase & {
  type: 'ConditionalExpression',
  test: AcornNode,
  consequent: AcornNode,
  alternate: AcornNode
}

export type UnaryExpressionNode = AcornNodeBase & {
  type: 'UnaryExpression',
  operator: string,
  prefix: boolean
  argument: AcornNode
}

export type UpdateExpressionNode = AcornNodeBase & {
  type: 'UpdateExpression',
  operator: string,
  prefix: boolean
  argument: AcornNode
}

export type LogicalExpressionNode = AcornNodeBase & {
  type: 'LogicalExpression',
  operator: string,
  left: AcornNode,
  right: AcornNode,
  needParen?: boolean
}

export type IfStatementNode = AcornNodeBase & {
  type: 'IfStatement',
  test: AcornNode,
  consequent: AcornNode,
  alternate: AcornNode
}

export type WhileStatementNode = AcornNodeBase & {
  type: 'WhileStatement',
  test: AcornNode,
  body: AcornNode
}

export type DoWhileStatementNode = AcornNodeBase & {
  type: 'DoWhileStatement'
  test: AcornNode,
  body: AcornNode
}

export type AssignmentExpressionNode = AcornNodeBase & {
  type: 'AssignmentExpression'
  operator: string,
  left: AcornNode,
  right: AcornNode
}

export type ForStatementNode = AcornNodeBase & {
  type: 'ForStatement'
  body: AcornNode,
  init: AcornNode,
  test: AcornNode,
  update: AcornNode
}

export type BreakStatementNode = AcornNodeBase & {
  type: 'BreakStatement',
  label: null | IdentifierNode
}

export type LabeledStatementNode = AcornNodeBase & {
  type: 'LabeledStatement'
  label: IdentifierNode,
  body: AcornNode
}

export type ContinueStatementNode = AcornNodeBase & {
  type: 'ContinueStatement'
  label: null | IdentifierNode
}

export type SwitchStatementNode = AcornNodeBase & {
  type: 'SwitchStatement'
  discriminant: AcornNode
  cases: SwitchCaseNode[]
}

export type SwitchCaseNode = AcornNodeBase & {
  type: 'SwitchCase'
  test: AcornNode | null
  consequent: AcornNode[]
}

export type ForInStatementNode = AcornNodeBase & {
  type: 'ForInStatement'
  left: AcornNode
  right: AcornNode
  body: AcornNode
}

export type ForOfStatementNode = AcornNodeBase & {
  type: 'ForOfStatement',
  left: AcornNode
  right: AcornNode
  body: AcornNode
}

export type ObjectExpressionNode = AcornNodeBase & {
  type: 'ObjectExpression',
  properties: PropertyNode[]
}

export type PropertyNode = AcornNodeBase & {
  type: 'Property',
  key: IdentifierNode,
  kind: 'init',
  computed: boolean,
  method: boolean,
  shorthand: boolean,
  value: AcornNode
}

export type YieldExpressionNode = AcornNodeBase & {
  type: 'YieldExpression',
  delegate: boolean,
  argument: AcornNode
}

export type AwaitExpressionNode = AcornNodeBase & {
  type: 'AwaitExpression',
  argument: AcornNode
}

export type ArrayExpression = AcornNodeBase & {
  type: 'ArrayExpression',
  elements: AcornNode[]
}

export type ThrowStatementNode = AcornNodeBase & {
  type: 'ThrowStatement',
  argument: AcornNode
}

export type TryStatementNode = AcornNodeBase & {
  type: 'TryStatement'
  block: AcornNode,
  handler: AcornNode,
  finalizer: AcornNode
}

export type CatchClauseNode = AcornNodeBase & {
  type: 'CatchClause',
  param: IdentifierNode,
  body: AcornNode
}

export type ThisExpressionNode = AcornNodeBase & {
  type: 'ThisExpression',
  start: number,
  end: number
}
