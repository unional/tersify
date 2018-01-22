import { test } from 'ava'

import { tersify } from './index'

test('tersify RegExp to its string representation.', t => {
  t.is(tersify(/foo/), '/foo/')
  t.is(tersify(/foo/g), '/foo/g')
})
