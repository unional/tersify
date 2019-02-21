
import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { TersifyContext, trim } from '../tersifyValue';
import { AcronNode, ArrowFunctionExpressionNode, AssignmentPatternNode, BlockStatementNode, CallExpressionNode, ExpressionStatementNode, FunctionExpressionNode, IdentifierNode, LiteralNode, MemberExpressionNode, RestElementNode, ReturnStatementNode, SymbolForNode } from './AcornTypes';

export function tersifyAcorn(context: TersifyContext, value: any, length: number) {
  const parser = Parser.extend(bigInt)

  if (typeof value === 'function') {
    const node = parser.parseExpressionAt(`(${value.toString()})`, 0) as AcronNode
    return tersifyAcornNode(context, node, length)
  }
}

function tersifyAcornNode(context: TersifyContext, node: AcronNode, length: number) {
  switch (node.type) {
    case 'Identifier':
      return tersifyIdentifierNode(context, node, length)
    case 'Literal':
      return tersifyLiteralNode(context, node, length);
    case 'AssignmentPattern':
      return tersifyAssignmentPatternNode(context, node, length)
    case 'RestElement':
      return tersifyRestElementNode(context, node, length)
    case 'ArrowFunctionExpression':
      return tersifyArrowExpression(context, node, length)
    case 'ExpressionStatement':
      return tersifyExpressionStatement(context, node, length)
    case 'CallExpression':
      return tersifyCallExpression(context, node, length)
    case 'MemberExpression':
      return tersifyMemberExpression(context, node, length)
    case 'FunctionExpression':
      return tersifyFunctionExpressionNode(context, node, length)
    case 'BlockStatement':
      return tersifyBlockStatementNode(context, node, length)
    case 'ReturnStatement':
      return tersifyReturnStatementNode(context, node, length)
  }

  throw node
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

function tersifyArrowExpression(context: TersifyContext, node: ArrowFunctionExpressionNode, length: number) {
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
  // if (node.argument.type === 'Literal') return node.argument.raw
  // if (node.argument.type === 'Identifier') return node.argument.name
  // if (node.argument.type === 'CallExpression') {
  //   console.log(node.argument.callee)
  //   if (node.argument.callee.type === 'Identifier' &&
  //     node.argument.callee.name === 'Symbol')
  //     return tersifySymbol(context, Symbol(), Infinity)
  //   // else if (node.argument.callee.type === 'MemberExpression')
  // }
  // // console.log(node)
  // return ''
}

function tersifyExpressionStatement(context: TersifyContext, node: ExpressionStatementNode, length: number) {
  return tersifyAcornNode(context, node.expression, length)
}

function tersifyMemberExpression(context: TersifyContext, node: MemberExpressionNode, length: number) {
  return `${tersifyAcornNode(context, node.object, length)}.${tersifyAcornNode(context, node.property, length)}`
}

function tersifyCallExpression(context: TersifyContext, node: CallExpressionNode, length: number) {
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

// function formatArrow(str: string, maxLength) {
//   const lines = str.split(EOL)
//   const trimmedlines = lines.map(l => l.trim())
//   let singleLine = trimmedlines.join(' ');
//   console.log(singleLine)
//   // https://regex101.com/r/1Nv7hN/2
//   const matchSingleExpression = /(.*)=> { return (.*); }/.exec(singleLine)
//   if (matchSingleExpression) {
//     singleLine = `${matchSingleExpression[1]}=> ${matchSingleExpression[2]}`
//   }

//   if (singleLine.length > maxLength) {
//     singleLine = trimWithBracket(singleLine, maxLength)
//   }
//   if (singleLine.length > maxLength) {
//     // after trimming it is still too long
//     singleLine = singleLine.slice(0, maxLength - 3) + '...'
//   }

//   // trim `{ }` to `{}` in wallaby environment.
//   return singleLine.replace(/{ }/g, '{}')
// }

// function trimWithBracket(singleLine, maxLength) {
//   // https://regex101.com/r/HrkxfW/1
//   const parts = /(.* { )(.*)( })/.exec(singleLine)
//   return parts ? parts[1] + parts[2].slice(0, maxLength - parts[1].length - parts[3].length - 3) + '...' + parts[3] : singleLine;
// }

// function formatFn(str: string, maxLength) {
//   const lines = str.split(EOL)
//   const trimmedlines = lines.map(l => l.trim())
//   let singleLine = trimmedlines.join(' ');

//   if (singleLine.length > maxLength) {
//     singleLine = trimWithBracket(singleLine, maxLength)
//   }

//   if (singleLine.length > maxLength) {
//     // after trimming it is still too long
//     singleLine = singleLine.slice(0, maxLength - 3) + '...'
//   }

//   // trim `{ }` to `{}` in wallaby environment.
//   return singleLine.replace(/{ }/g, '{}')
// }
