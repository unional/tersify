
import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { TersifyContext, trim } from '../tersifyValue';
import { AcronNode, ArrowFunctionExpressionNode, AssignmentExpressionNode, AssignmentPatternNode, BinaryExpressionNode, BlockStatementNode, BreakStatementNode, CallExpressionNode, ConditionalExpressionNode, ContinueStatementNode, DoWhileStatementNode, ExpressionStatementNode, ForInStatementNode, ForOfStatementNode, ForStatementNode, FunctionExpressionNode, IdentifierNode, IfStatementNode, LabeledStatementNode, LiteralNode, LogicalExpressionNode, MemberExpressionNode, NewExpressionNode, RestElementNode, ReturnStatementNode, SwitchCaseNode, SwitchStatementNode, SymbolForNode, UnaryExpressionNode, UpdateExpressionNode, VariableDeclarationNode, VariableDeclaratorNode, WhileStatementNode } from './AcornTypes';

export function tersifyAcorn(context: TersifyContext, value: any, length: number) {
  const parser = Parser.extend(bigInt)

  if (typeof value === 'function') {
    const node = parser.parseExpressionAt(`(${value.toString()})`, 0) as AcronNode
    return tersifyAcornNode(context, node, length)
  }
}

function tersifyAcornNode(context: TersifyContext, node: AcronNode | null, length: number) {
  // console.log(node)
  if (!node) return ''
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
  }

  throw node
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
  let left = tersifyAcornNode(context, node.left, length)
  if (node.left.type === 'BinaryExpression') left = `(${left})`
  let right = tersifyAcornNode(context, node.right, length)
  if (node.right.type === 'BinaryExpression') right = `(${right})`
  return `${left} ${node.operator} ${right}`
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
      if (s && s !== 'return') statements.push(s)
    }
  })
  return `{${statements.length ? ` ${statements.join('; ')} ` : ''}}`
}

function tersifyReturnStatementNode(context: TersifyContext, node: ReturnStatementNode, length: number) {
  if (!node.argument) return 'return'
  return `return ${tersifyAcornNode(context, node.argument, length)}`
}
