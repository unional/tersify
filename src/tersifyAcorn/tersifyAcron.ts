
import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { AcornNode, ArrowFunctionExpressionNode, AssignmentExpressionNode, AssignmentPatternNode, BinaryExpressionNode, BlockStatementNode, BreakStatementNode, CallExpressionNode, ConditionalExpressionNode, ContinueStatementNode, DoWhileStatementNode, ExpressionStatementNode, ForInStatementNode, ForOfStatementNode, ForStatementNode, FunctionExpressionNode, IdentifierNode, IfStatementNode, LabeledStatementNode, LiteralNode, LogicalExpressionNode, MemberExpressionNode, NewExpressionNode, RestElementNode, ReturnStatementNode, SwitchCaseNode, SwitchStatementNode, SymbolForNode, UnaryExpressionNode, UpdateExpressionNode, VariableDeclarationNode, VariableDeclaratorNode, WhileStatementNode, ObjectExpressionNode, PropertyNode, YieldExpressionNode, AwaitExpressionNode, ArrayExpression, ThrowStatementNode, TryStatementNode, CatchClauseNode, ThisExpressionNode, FunctionDeclarationNode, ClassExpressionNode, ClassBodyNode, MethodDefinitionNode, SpreadElementNode } from './AcornTypes';
import { isHigherOperatorOrder } from './isHigherBinaryOperatorOrder';
import { TersifyContext } from '../typesInternal';
import { trim } from '../trim';
import { FailedToParse } from './FailedToParse';

export function tersifyAcorn(context: TersifyContext, value: any, length: number) {
  const parser = Parser.extend(bigInt)

  const fnStr = getFunctionString(value)
  const node = parser.parseExpressionAt(`(${fnStr})`, 0) as AcornNode
  return tersifyAcornNode(context, node, length)
}

function getFunctionString(value: Function) {
  const fnStr: string = value.toString()
  const matches = /^([^\s]+)\(/.exec(fnStr)
  return matches && matches[1] !== 'function' ?
    `function ${fnStr}` :
    fnStr
}

function tersifyAcornNode(context: TersifyContext, node: AcornNode | null, length: number): string {
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
    case 'IfStatement':
      return tersifyIfStatementNode(context, node, length)
    case 'WhileStatement':
      return tersifyWhileStatementNode(context, node, length)
    case 'AssignmentExpression':
      return tersifyAssignementExpressionNode(context, node, length)
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
      return tersifySwitchCaseNdoe(context, node, length)
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
    default:
      // istanbul ignore next
      throw new FailedToParse((node as any).type, node)
  }
}

function tersifyCatchClauseNode(context: TersifyContext, node: CatchClauseNode, length: number) {
  const param = tersifyAcornNode(context, node.param, length)
  const body = tersifyAcornNode(context, node.body, length)
  return `catch${param ? ` (${param})` : ''}${body ? ` ${body}` : ''}`
}

function tersifyTryStatementNode(context: TersifyContext, node: TryStatementNode, length: number) {
  const block = tersifyAcornNode(context, node.block, length)
  const handler = tersifyAcornNode(context, node.handler, length)
  const finalizer = tersifyAcornNode(context, node.finalizer, length)

  return `try ${block}${handler ? ` ${handler}` : ''}${finalizer ? ` finally ${finalizer}` : ''}`
}

function tersifyThrowStatementNode(context: TersifyContext, node: ThrowStatementNode, length: number) {
  return `throw ${tersifyAcornNode(context, node.argument, length)}`
}

function tersifyArrayExpressionNode(context: TersifyContext, node: ArrayExpression, length: number) {
  const elements = node.elements.map(e => tersifyAcornNode(context, e, length))
  return trim(context, `[${elements.join(', ')}]`, length)
}

function tersifyAwaitExpressionNode(context: TersifyContext, node: AwaitExpressionNode, length: number) {
  return `await ${tersifyAcornNode(context, node.argument, length)}`
}

function tersifyYieldExpressionNode(context: TersifyContext, node: YieldExpressionNode, length: number) {
  const argument = tersifyAcornNode(context, node.argument, length)
  return `yield ${argument}`
}

function tersifyPropertyNode(context: TersifyContext, node: PropertyNode, length: number) {
  const key = tersifyAcornNode(context, node.key, length)
  const valueNode = node.value
  if (valueNode.type === 'FunctionExpression') {
    const async = valueNode.async ? 'async ' : ''
    const generator = valueNode.generator ? '*' : ''
    const params = tersifyFunctionParams(context, valueNode.params)
    const body = tersifyFunctionBody(context, valueNode.body)
    return `${async}${generator}${key}${params} ${body}`
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

function tersifyObjectExpressionNode(context: TersifyContext, node: ObjectExpressionNode, length: number) {
  const properties = node.properties.map(p => tersifyAcornNode(context, p, length))
  return `{ ${properties.join(', ')} }`
}

function tersifyForOfStatementNode(context: TersifyContext, node: ForOfStatementNode, length: number) {
  const left = tersifyAcornNode(context, node.left, length)
  const right = tersifyAcornNode(context, node.right, length)
  const body = tersifyAcornNode(context, node.body, length)
  return `for (${left} of ${right}) ${body}`
}

function tersifyForInStatementNode(context: TersifyContext, node: ForInStatementNode, length: number) {
  const left = tersifyAcornNode(context, node.left, length)
  const right = tersifyAcornNode(context, node.right, length)
  const body = tersifyAcornNode(context, node.body, length)
  return `for (${left} in ${right}) ${body}`
}

function tersifySwitchCaseNdoe(context: TersifyContext, node: SwitchCaseNode, length: number) {
  const test = tersifyAcornNode(context, node.test, length)
  const consequent = node.consequent.map(c => tersifyAcornNode(context, c, length))

  if (node.test) {
    return `case ${test}: ${consequent.join(' ')}`
  }
  else {
    return `default: ${consequent.join(' ')}`
  }
}

function tersifySwitchStatementNode(context: TersifyContext, node: SwitchStatementNode, length: number) {
  const discriminant = tersifyAcornNode(context, node.discriminant, length)
  const cases = node.cases.map(c => tersifyAcornNode(context, c, length))
  return `switch (${discriminant}) { ${cases.join('; ')} }`
}

function tersifyContinueStatementNode(context: TersifyContext, node: ContinueStatementNode, length: number) {
  const label = tersifyAcornNode(context, node.label, length)
  return label ? `continue ${label}` : 'continue'
}

function tersifyLabeledStatementNode(context: TersifyContext, node: LabeledStatementNode, length: number) {
  const label = tersifyAcornNode(context, node.label, length)
  const body = tersifyAcornNode(context, node.body, length)

  return `${label}: ${body}`
}

function tersifyBreakStatementNode(context: TersifyContext, node: BreakStatementNode, length: number) {
  const label = tersifyAcornNode(context, node.label, length)
  return label ? `break ${label}` : 'break'
}

function tersifyForStatementNode(context: TersifyContext, node: ForStatementNode, length: number) {
  const test = tersifyAcornNode(context, node.test, length)
  const init = tersifyAcornNode(context, node.init, length)
  const update = tersifyAcornNode(context, node.update, length)
  const body = tersifyAcornNode(context, node.body, length)

  return `for (${init};${test ? ` ${test}` : ''};${update ? ` ${update}` : ''}) ${body}`
}

function tersifyAssignementExpressionNode(context: TersifyContext, node: AssignmentExpressionNode, length: number) {
  const left = tersifyAcornNode(context, node.left, length)
  const right = tersifyAcornNode(context, node.right, length)
  return `${left} ${node.operator} ${right}`
}

function tersifyWhileStatementNode(context: TersifyContext, node: WhileStatementNode, length: number) {
  const test = tersifyAcornNode(context, node.test, length)
  const body = tersifyAcornNode(context, node.body, length)
  return `while (${test}) ${body}`
}

function tersifyDoWhileStatementNode(context: TersifyContext, node: DoWhileStatementNode, length: number) {
  const test = tersifyAcornNode(context, node.test, length)
  const body = tersifyAcornNode(context, node.body, length)
  if (node.body.type === 'BlockStatement')
    return `do ${body} while (${test})`
  else
    return `do ${body}; while (${test})`
}

function tersifyUnaryExpressionNode(context: TersifyContext, node: UnaryExpressionNode, length: number) {
  if (node.operator === 'void') return `${node.operator} ${tersifyAcornNode(context, node.argument, length)}`
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
  const test = tersifyAcornNode(context, node.test, length)
  const consequent = tersifyAcornNode(context, node.consequent, length)
  const alternate = tersifyAcornNode(context, node.alternate, length)
  return `${test} ? ${consequent} : ${alternate}`
}

function tersifyIfStatementNode(context: TersifyContext, node: IfStatementNode, length: number) {
  const test = tersifyAcornNode(context, node.test, length)
  const consequent = tersifyAcornNode(context, node.consequent, length)
  const alternate = tersifyAcornNode(context, node.alternate, length)
  if (alternate) {
    if (node.consequent.type !== 'BlockStatement') {
      return `if (${test}) ${consequent}; else ${alternate}`
    }
    else {
      return `if (${test}) ${consequent} else ${alternate}`
    }
  }
  else
    return `if (${test}) ${consequent}`
}

function tersifyBinaryExpressionNode(context: TersifyContext, node: BinaryExpressionNode | LogicalExpressionNode, length: number) {
  if ((node.left.type === 'BinaryExpression' || node.left.type === 'LogicalExpression') && isHigherOperatorOrder(node.operator, node.left.operator)) {
    node.left.needParen = true
  }
  const left = tersifyAcornNode(context, node.left, length)

  if ((node.right.type === 'BinaryExpression' || node.right.type === 'LogicalExpression') && isHigherOperatorOrder(node.operator, node.right.operator)) {
    node.right.needParen = true
  }
  const right = tersifyAcornNode(context, node.right, length)

  return node.needParen ?
    `(${left} ${node.operator} ${right})` :
    `${left} ${node.operator} ${right}`
}

function tersifyNewExpressionNode(context: TersifyContext, node: NewExpressionNode, length: number) {
  return tersifyNewDate(node) || `new ${node.callee.name}(${node.arguments.map(a => tersifyAcornNode(context, a, length)).join(', ')})`
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

function tersifyVeriableDeclaratorNode(context: TersifyContext, node: VariableDeclaratorNode, length: number) {
  return `${node.id.name}${node.init ? ` = ${tersifyAcornNode(context, node.init, length)}` : ''}`
}

function tersifyVariableDeclarationNode(context: TersifyContext, node: VariableDeclarationNode, length: number) {
  return `${node.kind} ${node.declarations.map(d => tersifyAcornNode(context, d, length)).join(', ')}`
}

function tersifyIdentifierNode(context: TersifyContext, node: IdentifierNode, _length: number) {
  return node.name === 'Symbol' ? 'Sym' : node.name
}

function tersifyLiteralNode(context: TersifyContext, node: LiteralNode, _length: number) {
  return node.raw
}

function tersifyRestElementNode(context: TersifyContext, node: RestElementNode | SpreadElementNode, _length: number) {
  return `...${node.argument.name}`
}

function tersifyAssignmentPatternNode(context: TersifyContext, node: AssignmentPatternNode, length: number) {
  const eq = ' = '
  return `${node.left.name}${eq}${tersifyAcornNode(context, node.right, length - node.left.name.length - eq.length)}`
}

function tersifyArrowExpressionNode(context: TersifyContext, node: ArrowFunctionExpressionNode, length: number) {
  const async = node.async ? 'async ' : ''
  const generator = node.generator ? '*' : ''
  const arrow = ` => `
  const declarationLen = async.length + generator.length + arrow.length

  let params = node.params.length > 0 ? tersifyFunctionParams(context, node.params) : '()'
  const paramsContent = params.slice(1, params.length - 1)

  if (node.params.length === 1) {
    params = paramsContent
  }
  const minParam = paramsContent.length <= 3 ?
    params :
    node.params.length > 1 ?
      `(${trim(context, paramsContent, 3)})` :
      trim(context, paramsContent, 3)

  const minPrebodyLen = declarationLen + minParam.length
  const prebodyLen = declarationLen + params.length
  const singleBodyNode = getSingleStatementBodyNode(context, node.body)
  let body = singleBodyNode ?
    tersifyArrowBodyAsSingleStatement(context, singleBodyNode) :
    tersifyFunctionBody(context, node.body)

  if (singleBodyNode && singleBodyNode.type === 'ObjectExpression') {
    body = `(${body})`
  }
  if (minPrebodyLen + body.length > length) {
    if (singleBodyNode) {
      const bodyContent = trim(context, body, length - minPrebodyLen)
      const result = `${async}${generator}${minParam}${arrow}${bodyContent.length === 0 ?
        '{}' :
        singleBodyNode.type === 'ObjectExpression' ?
          `(${bodyContent})` :
          bodyContent}`
      return result.length > length ? trim(context, result, length) : result
    }
    else {
      const paramAndSpaceLen = 2 // '{ ' or ' }'
      const bodyContent = trim(context, body.slice(2, body.length - paramAndSpaceLen), length - minPrebodyLen - paramAndSpaceLen * 2)
      const result = `${async}${generator}${minParam}${arrow}${bodyContent.length === 0 ? '{}' : `{ ${bodyContent} }`}`
      return result.length > length ? trim(context, result, length) : result
    }
  }
  else if (prebodyLen + body.length > length) {
    if (node.params.length === 1) {
      return `${async}${generator}${trim(context, paramsContent, length - body.length - declarationLen)}${arrow}${body}`
    }
    return `${async}${generator}(${trim(context, paramsContent, length - body.length - declarationLen - 2)})${arrow}${body}`
  }
  else {
    return `${async}${generator}${params}${arrow}${body}`
  }
}

function getSingleStatementBodyNode(context: TersifyContext, node: AcornNode) {
  if (node.type !== 'BlockStatement') return node
  if (node.body.length === 1 && node.body[0].type === 'ReturnStatement') return node.body[0]
  return undefined
}

function tersifyArrowBodyAsSingleStatement(context: TersifyContext, node: AcornNode) {
  if (node.type === 'ReturnStatement') {
    if (!node.argument) return `{}`

    if (node.argument.type === 'ObjectExpression') {
      return `(${tersifyAcornNode(context, node.argument, Infinity)})`
    }
    return tersifyAcornNode(context, node.argument, Infinity)
  }
  return tersifyAcornNode(context, node, Infinity)
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

function tersifyFunctionExpressionNode(context: TersifyContext, node: FunctionExpressionNode | FunctionDeclarationNode, length: number) {
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
    }
    else {
      const bodyContent = body.slice(2, body.length - 2)
      const result = `${async}${token}${generator}${id}${minParam}${space}${bodyContent.length === 0 ?
        '{}' :
        `{ ${trim(context, bodyContent, length - minPrebodyLen - 4)} }`}`
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

function tersifyFunctionBody(context: TersifyContext, value: AcornNode) {
  return tersifyAcornNode(context, value, Infinity)
}

function tersifyBlockStatementNode(context: TersifyContext, node: BlockStatementNode | ClassBodyNode, length: number) {
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

function tersifyReturnStatementNode(context: TersifyContext, node: ReturnStatementNode, length: number) {
  if (!node.argument) return 'return'
  return `return ${tersifyAcornNode(context, node.argument, length)}`
}

function tersifyThisExpression(_context: TersifyContext, _node: ThisExpressionNode, _length: number) {
  return `this`
}

function tersifyClassExpression(context: TersifyContext, node: ClassExpressionNode, length: number) {
  const classStr = trim(context, `class${node.id ? ` ${node.id.name}` : ' '}{}`, length)
  const prefix = classStr.slice(0, Math.max(3, classStr.length - 2))
  const body = tersifyAcornNode(context, node.body, length - prefix.length)
  return `${prefix}${length >= prefix.length + body.length || body.length > 3 ? body : trim(context, '...', length - prefix.length)}`
}

function tersifyMethodDefinition(context: TersifyContext, node: MethodDefinitionNode, length: number) {
  const staticStr = node.static ? 'static ' : ''
  const fnExpNode = node.value
  const async = fnExpNode.async ? 'async ' : ''
  const generator = fnExpNode.generator ? '*' : ''
  const id = node.key.name
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
    }
    else {
      const bodyContent = body.slice(2, body.length - 2)
      const result = `${staticStr}${async}${generator}${id}${minParam}${space}${bodyContent.length === 0 ?
        '{}' :
        `{ ${trim(context, bodyContent, length - minPrebodyLen - 4)} }`}`
      return result.length > length ? trim(context, result, length) : result
    }
  }
  else if (prebodyLen + body.length > length) {
    if (minPrebodyLen + body.length < length) {
      return `${staticStr}${async}${generator}${id}(${trim(context, paramsContent, length - body.length - declarationLen - 2)})${space}${body}`
    }
    return trim(context, `${staticStr}${async}${generator}${id}${minParam}${space}${body}`, length)
  }
  else {
    return trim(context, `${staticStr}${async}${generator}${id}${params}${space}${body}`, length)
  }
}
