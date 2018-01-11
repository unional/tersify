
// istanbul ignore next
const isNode = typeof module !== 'undefined' && module['e' + 'xports'] && !module['webpackPolyfill']

// istanbul ignore next
export const EOL = isNode && /^win/.test(process.platform) ? '\r\n' : '\n'
export const defaultOptions = { maxLength: 120 }
