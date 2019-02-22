
export type AcronNode = IdentifierNode | LiteralNode | CallExpressionNode |
  FunctionExpressionNode | BlockStatementNode | ReturnStatementNode |
  AssignmentPatternNode | RestElementNode | ArrowFunctionExpressionNode |
  MemberExpressionNode | ExpressionStatementNode | VariableDeclarationNode |
  VariableDeclaratorNode | NewExpressionNode | BinaryExpressionNode |
  ConditionalExpressionNode | UnaryExpressionNode | UpdateExpressionNode | LogicalExpressionNode

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

export type VariableDeclarationNode = AcornNodeBase & {
  type: 'VariableDeclaration'
  kind: 'const',
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
  arguments: AcronNode[]
}

export type BinaryExpressionNode = AcornNodeBase & {
  type: 'BinaryExpression',
  operator: string,
  left: AcronNode,
  right: AcronNode
}

export type ConditionalExpressionNode = AcornNodeBase & {
  type: 'ConditionalExpression',
  test: AcronNode,
  consequent: AcronNode,
  alternate: AcronNode
}

export type UnaryExpressionNode = AcornNodeBase & {
  type: 'UnaryExpression',
  operator: string,
  prefix: boolean
  argument: AcronNode
}

export type UpdateExpressionNode = AcornNodeBase & {
  type: 'UpdateExpression',
  operator: string,
  prefix: boolean
  argument: AcronNode
}

export type LogicalExpressionNode = AcornNodeBase & {
  type: 'LogicalExpression',
  operator: string,
  left: AcronNode,
  right: AcronNode
}
