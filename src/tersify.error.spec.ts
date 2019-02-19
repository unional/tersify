import t from 'assert'

import { tersify } from './index'

test('error will tersify with its message', () => {
  t.strictEqual(tersify(new Error('1')), `{ message: '1' }`)
})

test('custom error', () => {
  class CustomError extends Error {
    prop = 1
    constructor(message: string) {
      super(message)
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }

  const err = new CustomError('custom')
  t.strictEqual(tersify(err), `{ prop: 1, message: 'custom' }`)
})
