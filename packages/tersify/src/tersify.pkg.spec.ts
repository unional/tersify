import * as ws from 'ws'
import { tersify } from './tersify.js'

describe('ws', () => {
	it('works with WebSocket', () => {
		const r = tersify(ws.WebSocket)
		expect(r).not.toContain('unsupported')
	})
})
