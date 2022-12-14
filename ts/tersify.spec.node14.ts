import { tersify } from './index.js'

describe('function', () => {
  test('nullish coalescing operator', () => {
    function nco(s) { return s ?? 1 }

    expect(tersify(nco)).toBe('fn nco(s) { return s ?? 1 }')
  })
})
