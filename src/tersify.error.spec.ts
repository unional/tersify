import { test } from 'ava'

import { tersify } from './index'

test('error will tersify with its message', t => {
  t.is(tersify(new Error('1')), `{ message: '1' }`)
})

test('custom error', t => {
  class CustomError extends Error {
    prop = 1
    constructor(message: string) {
      super(message)
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }

  const err = new CustomError('custom')
  t.is(tersify(err), `{ prop: 1, message: 'custom' }`)
})
