import { test } from 'ava'
import { tersify } from '.';

test('short string will keep as is', t => {
  t.is(tersify('abc'), 'abc')
})

test('long string will trim', t => {
  const actual = tersify('12345678901234567890123456789012345678901234567890123456789012345678901234567890', { maxLength: 50 })

  t.is(actual, '12345678901234567890123456789012345678901234567...')
})
