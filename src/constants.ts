import { TersifyOptions } from './interfaces'

// istanbul ignore next
// tslint:disable-next-line
const isNode = typeof module !== 'undefined' && module['e' + 'xports'] && !module['webpackPolyfill']

// istanbul ignore next
// tslint:disable-next-line
export const EOL = isNode && /^win/.test(process.platform) ? '\r\n' : '\n'
export const defaultOptions: TersifyOptions = { maxLength: 120 }
