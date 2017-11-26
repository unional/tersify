import os = require('os')

export function tersifyFunction(fn: Function, option = { maxLength: 120 }) {
  const str = fn.toString()
  if (isArrow(str))
    return formatArrow(str, option.maxLength)
  else
    return formatFn(str, option.maxLength)
}

function isArrow(str: string) {
  const lines = str.split(os.EOL)

  // https://regex101.com/r/0HtLzb/1
  return /[\(]?.*[\)]? =>/.test(lines[0])
}

function formatArrow(str: string, maxLength) {
  const lines = str.split(os.EOL)
  const trimmedlines = lines.map(l => l.trim())
  let singleLine = trimmedlines.join(' ');

  // https://regex101.com/r/1Nv7hN/2
  const matchSingleExpression = /=> { return (.*); }/.exec(singleLine)
  if (matchSingleExpression) {
    const singleExpression = matchSingleExpression[1]
    singleLine = lines[0].slice(0, lines[0].length - 1) + singleExpression
  }

  if (singleLine.length > maxLength) {
    singleLine = trimWithBracket(singleLine, maxLength)
  }
  if (singleLine.length > maxLength) {
    // after trimming it is still too long
    singleLine = singleLine.slice(0, maxLength - 3) + '...'
  }
  return singleLine
}

function trimWithBracket(singleLine, maxLength) {
  // https://regex101.com/r/HrkxfW/1
  const parts = /(.* { )(.*)( })/.exec(singleLine)
  return parts ? parts[1] + parts[2].slice(0, maxLength - parts[1].length - parts[3].length - 3) + '...' + parts[3] : singleLine
}

function formatFn(str: string, maxLength) {
  const lines = str.split(os.EOL)
  const trimmedlines = lines.map(l => l.trim())
  let singleLine = trimmedlines.join(' ');

  if (singleLine.length > maxLength) {
    singleLine = trimWithBracket(singleLine, maxLength)
  }

  if (singleLine.length > maxLength) {
    // after trimming it is still too long
    singleLine = singleLine.slice(0, maxLength - 3) + '...'
  }
  return singleLine
}
