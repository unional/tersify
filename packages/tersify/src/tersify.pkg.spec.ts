import { tersify } from './tersify.js'
import * as ws from 'ws'

describe('ws', () => {
	it('works with WebSocket', () => {
		const r = tersify(ws.WebSocket)
		expect(r).not.toContain('unsupported')
	})
})
