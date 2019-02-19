
export type AcronNode = IdentifierNode | LiteralNode | CallExpressionNode |
  FunctionExpressionNode | BlockStatementNode | ReturnStatementNode |
  AssignmentPatternNode | RestElementNode | ArrowFunctionExpressionNode |
  MemberExpressionNode | ExpressionStatementNode

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
  body: AcronNode
} & AcornNodeBase

export type BlockStatementNode = AcornNodeBase & {
  type: 'BlockStatement',
  body: AcronNode[]
}

export type ReturnStatementNode = AcornNodeBase & {
  type: 'ReturnStatement',
  argument: LiteralNode | IdentifierNode | CallExpressionNode | MemberExpressionNode | null
}


export type AssignmentPatternNode = AcornNodeBase & {
  type: 'AssignmentPattern',
  left: IdentifierNode,
  right: AcronNode
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
  body: AcronNode
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
