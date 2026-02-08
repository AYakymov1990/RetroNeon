import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const cloudflareRedirectsPlugin: Plugin = {
  name: 'cloudflare-redirects-plugin',
  apply: 'build',
  generateBundle() {
    const redirectsPath = resolve(process.cwd(), 'public/_redirects')
    const redirectsContent = readFileSync(redirectsPath, 'utf8')

    this.emitFile({
      type: 'asset',
      fileName: '_redirects',
      source: redirectsContent,
    })
  },
}

export default defineConfig({
  plugins: [react(), cloudflareRedirectsPlugin],
  test: {
    environment: 'jsdom',
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
  },
})
