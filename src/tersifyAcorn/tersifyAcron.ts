
import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { TersifyContext, trim } from '../tersifyValue';
import { AcronNode, ArrowFunctionExpressionNode, AssignmentPatternNode, BlockStatementNode, CallExpressionNode, ExpressionStatementNode, FunctionExpressionNode, IdentifierNode, LiteralNode, MemberExpressionNode, RestElementNode, ReturnStatementNode, SymbolForNode, VariableDeclarationNode, VariableDeclaratorNode, NewExpressionNode, BinaryExpressionNode, ConditionalExpressionNode, UnaryExpressionNode, UpdateExpressionNode, LogicalExpressionNode } from './AcornTypes';

export function tersifyAcorn(context: TersifyContext, value: any, length: number) {
  const parser = Parser.extend(bigInt)

  if (typeof value === 'function') {
    const node = parser.parseExpressionAt(`(${value.toString()})`, 0) as AcronNode
    return tersifyAcornNode(context, node, length)
  }
}

function tersifyAcornNode(context: TersifyContext, node: AcronNode, length: number) {
  // console.log(node)
  switch (node.type) {
    case 'Identifier':
      return tersifyIdentifierNode(context, node, length)
    case 'Literal':
      return tersifyLiteralNode(context, node, length)
    case 'AssignmentPattern':
      return tersifyAssignmentPatternNode(context, node, length)
    case 'RestElement':
      return tersifyRestElementNode(context, node, length)
    case 'ArrowFunctionExpression':
      return tersifyArrowExpressionNode(context, node, length)
    case 'ExpressionStatement':
      return tersifyExpressionStatementNode(context, node, length)
    case 'CallExpression':
      return tersifyCallExpressionNode(context, node, length)
    case 'MemberExpression':
      return tersifyMemberExpressionNode(context, node, length)
    case 'FunctionExpression':
      return tersifyFunctionExpressionNode(context, node, length)
    case 'BlockStatement':
      return tersifyBlockStatementNode(context, node, length)
    case 'ReturnStatement':
      return tersifyReturnStatementNode(context, node, length)
    case 'VariableDeclaration':
      return tersifyVariableDeclarationNode(context, node, length)
    case 'VariableDeclarator':
      return tersifyVeriableDeclaratorNode(context, node, length)
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
  }

  throw node
}

function tersifyUnaryExpressionNode(context: TersifyContext, node: UnaryExpressionNode, length: number) {
  return node.prefix ?
    `${node.operator}${tersifyAcornNode(context, node.argument, length)}` :
    `${tersifyAcornNode(context, node.argument, length)}${node.operator}`
}
function tersifyUpdateExpressionNode(context: TersifyContext, node: UpdateExpressionNode, length: number) {
  return node.prefix ?
    `${node.operator}${tersifyAcornNode(context, node.argument, length)}` :
    `${tersifyAcornNode(context, node.argument, length)}${node.operator}`
}

function tersifyConditionalExpressionNode(context: TersifyContext, node: ConditionalExpressionNode, length: number) {
  return `${tersifyAcornNode(context, node.test, length)} ? ${tersifyAcornNode(context, node.consequent, length)} : ${tersifyAcornNode(context, node.alternate, length)}`
}

function tersifyBinaryExpressionNode(context: TersifyContext, node: BinaryExpressionNode | LogicalExpressionNode, length: number) {
  let left = tersifyAcornNode(context, node.left, length)
  if (node.left.type === 'BinaryExpression') left = `(${left})`
  let right = tersifyAcornNode(context, node.right, length)
  if (node.right.type === 'BinaryExpression') right = `(${right})`
  return `${left} ${node.operator} ${right}`
}

function tersifyNewExpressionNode(context: TersifyContext, node: NewExpressionNode, length: number) {
  return `new ${node.callee.name}(${node.arguments.map(a => tersifyAcornNode(context, a, length)).join(', ')})`
}

function tersifyVeriableDeclaratorNode(context: TersifyContext, node: VariableDeclaratorNode, length: number) {
  return `${node.id.name}${node.init ? ` = ${tersifyAcornNode(context, node.init, length)}` : ''}`
}

function tersifyVariableDeclarationNode(context: TersifyContext, node: VariableDeclarationNode, length: number) {
  return `${node.kind} ${node.declarations.map(d => tersifyAcornNode(context, d, length)).join(', ')}`
}

function tersifyIdentifierNode(context: TersifyContext, node: IdentifierNode, length: number) {
  return node.name === 'Symbol' ? 'Sym' : node.name
}

function tersifyLiteralNode(context: TersifyContext, node: LiteralNode, length: number) {
  return node.raw
}

function tersifyRestElementNode(context: TersifyContext, node: RestElementNode, length: number) {
  return `...${node.argument.name}`
}

function tersifyAssignmentPatternNode(context: TersifyContext, node: AssignmentPatternNode, length: number) {
  const eq = ' = '
  return `${node.left.name}${eq}${tersifyAcornNode(context, node.right, length - node.left.name.length - eq.length)}`
}

function tersifyArrowExpressionNode(context: TersifyContext, node: ArrowFunctionExpressionNode, length: number) {
  let async = node.async ? 'async ' : ''
  let generator = node.generator ? '*' : ''
  const arrow = ` => `
  const declarationLen = async.length + generator.length + arrow.length

  const params = node.params.length > 0 ? tersifyFunctionParams(context, node.params) : '()'
  const paramsContent = params.slice(1, params.length - 2)
  const minParam = paramsContent.length > 3 ? `(${trim(context, paramsContent, 3)})` : params

  const minPrebodyLen = declarationLen + minParam.length
  const prebodyLen = declarationLen + params.length
  // const maxBodyLength = length - minPrebodyLen
  const body = tersifyArrowBody(context, node.body)

  // console.log(params, body, minPrebodyLen + body.length > length, prebodyLen + body.length > length)
  // console.log(minPrebodyLen, body.length, length)
  if (minPrebodyLen + body.length > length) {
    const bodyContent = trim(context, body.slice(2, body.length - 2), length - minPrebodyLen - 4)
    const result = `${async}${generator}${minParam}${arrow}${bodyContent.length === 0 ? '{}' : `{ ${bodyContent} }`}`
    return result.length > length ? trim(context, result, length) : result
  }
  else if (prebodyLen + body.length > length) {
    return `${async}${generator}(${trim(context, paramsContent, length - body.length - declarationLen - 2)})${arrow}${body}`
  }
  else {
    return `${async}${generator}${params}${arrow}${body}`
  }
}

function tersifyArrowBody(context: TersifyContext, body: AcronNode) {
  const returnNode = getReturnStatementOfSingleStatmentBody(context, body)
  if (returnNode) {
    return tersifyArrowBodyAsSingleStatement(context, returnNode)
  }

  return tersifyFunctionBody(context, body)
}

function getReturnStatementOfSingleStatmentBody(context: TersifyContext, node: AcronNode) {
  return (node.type === 'BlockStatement' && node.body.length === 1 && node.body[0].type === 'ReturnStatement') ?
    node.body[0] as ReturnStatementNode :
    undefined
}

function tersifyArrowBodyAsSingleStatement(context: TersifyContext, node: ReturnStatementNode) {
  if (!node.argument) return `{}`
  return tersifyAcornNode(context, node.argument, Infinity)
}

function tersifyExpressionStatementNode(context: TersifyContext, node: ExpressionStatementNode, length: number) {
  return tersifyAcornNode(context, node.expression, length)
}

function tersifyMemberExpressionNode(context: TersifyContext, node: MemberExpressionNode, length: number) {
  return `${tersifyAcornNode(context, node.object, length)}.${tersifyAcornNode(context, node.property, length)}`
}

function tersifyCallExpressionNode(context: TersifyContext, node: CallExpressionNode, length: number) {
  if (isSymbolForNode(node)) {
    return `Sym(${node.arguments[0].value})`
  }
  const callee = tersifyAcornNode(context, node.callee, length)
  const params = tersifyFunctionParams(context, node.arguments)
  return `${callee}${params}`
}

function isSymbolForNode(node: CallExpressionNode): node is SymbolForNode {
  return node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'Symbol' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'for'

}

function tersifyFunctionExpressionNode(context: TersifyContext, node: FunctionExpressionNode, length: number) {
  let token = context.raw ? `function` : 'fn'
  let async = node.async ? 'async ' : ''
  let generator = node.generator ? '*' : ''
  let id = node.id ? ` ${node.id.name}` : ''
  const params = node.params.length > 0 ? tersifyFunctionParams(context, node.params) : '()'
  const space = ' '
  const declarationLen = async.length + token.length + generator.length + id.length + space.length

  const paramsContent = params.slice(1, params.length - 2)
  const minParam = paramsContent.length > 3 ? `(${trim(context, paramsContent, 3)})` : params
  const minPrebodyLen = declarationLen + minParam.length
  const prebodyLen = declarationLen + params.length
  const body = tersifyFunctionBody(context, node.body)
  if (minPrebodyLen + body.length > length) {
    // 5 = length of `{ . }` to indicate there are something in the body
    if (minPrebodyLen + 5 > length) {
      return trim(context, `${async}${token}${generator}${id}${minParam}${space}${body}`, length)
    }
    else {
      const bodyContent = body.slice(2, body.length - 2)
      const result = `${async}${token}${generator}${id}${minParam}${space}${bodyContent.length === 0 ? '{}' : `{ ${trim(context, bodyContent, length - minPrebodyLen - 4)} }`}`
      return result.length > length ? trim(context, result, length) : result
    }
  }
  else if (prebodyLen + body.length > length) {
    if (minPrebodyLen + body.length < length) {
      return `${async}${token}${generator}${id}(${trim(context, paramsContent, length - body.length - declarationLen - 2)})${space}${body}`
    }
    return trim(context, `${async}${token}${generator}${id}${minParam}${space}${body}`, length)
  }
  else {
    return trim(context, `${async}${token}${generator}${id}${params}${space}${body}`, length)
  }
}

function tersifyFunctionParams(context: TersifyContext, params: (IdentifierNode | LiteralNode)[]) {
  const result = params.reduce((p, v) => {
    p.push(tersifyAcornNode(context, v, Infinity))
    return p
  }, [] as string[])
  return `(${result.join(', ')})`
}

function tersifyFunctionBody(context: TersifyContext, value: AcronNode) {
  return tersifyAcornNode(context, value, Infinity)
}

function tersifyBlockStatementNode(context: TersifyContext, node: BlockStatementNode, length: number) {
  const bracketAndSpaceLength = 4
  length -= bracketAndSpaceLength
  let statements: string[] = []
  node.body.forEach(n => {
    if (length) {
      const s = tersifyAcornNode(context, n, length)
      length -= s.length
      if (s) statements.push(s)
    }
  })
  return `{${statements.length ? ` ${statements.join('; ')} ` : ''}}`
}

function tersifyReturnStatementNode(context: TersifyContext, node: ReturnStatementNode, length: number) {
  if (!node.argument) return ''
  return `return ${tersifyAcornNode(context, node.argument, length)}`
}
