import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [tailwindcss()],
	optimizeDeps: {
		include: ['react/jsx-dev-runtime']
	}
})
