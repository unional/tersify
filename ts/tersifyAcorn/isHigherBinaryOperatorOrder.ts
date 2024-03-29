// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
const operators = new Map<string, number>()
operators.set('!', 16)
operators.set('~', 16)
operators.set('+', 16)
operators.set('-', 16)
operators.set('++', 16)
operators.set('--', 16)
operators.set('**', 15)
operators.set('*', 14)
operators.set('/', 14)
operators.set('%', 14)
operators.set('+', 13)
operators.set('-', 13)
operators.set('<<', 12)
operators.set('>>', 12)
operators.set('>>>', 12)
operators.set('<', 11)
operators.set('<=', 11)
operators.set('>', 11)
operators.set('>=', 11)
operators.set('&', 9)
operators.set('^', 8)
operators.set('|', 7)
operators.set('&&', 6)
operators.set('||', 5)

export function isHigherOperatorOrder(op1: string, op2: string) {
	return operators.get(op1)! > operators.get(op2)!
}
