import { tersify } from './index.js'

describe('function', () => {
  test('optional chaining', () => {
    function oc(s) { return s?.a }

    expect(tersify(oc)).toBe('fn oc(s) { return s?.a }')
  })

  test('optional chaining invoke function', () => {
    function oc(s) { return s?.() }

    expect(tersify(oc)).toBe('fn oc(s) { return s?.() }')
  })

  test('optional chaining invoke function from indexed props', () => {
    function oc(s) { return s?.['x']?.() }

    expect(tersify(oc)).toBe(`fn oc(s) { return s?.['x']?.() }`)
  })
})
