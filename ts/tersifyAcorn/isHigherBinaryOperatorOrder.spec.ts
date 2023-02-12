import { isHigherOperatorOrder } from './isHigherBinaryOperatorOrder.js'

test.each(['-', '+', '<<', '<'])('* order is higher than %s', op2 => {
	expect(isHigherOperatorOrder('*', op2)).toBe(true)
})

test.each(['!', '!', '**', '/', '%'])('* order is NOT higher than %s', op2 => {
	expect(isHigherOperatorOrder('*', op2)).toBe(false)
})
