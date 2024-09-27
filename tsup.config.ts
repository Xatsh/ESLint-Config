import { defineConfig } from 'tsup'

export default defineConfig({
  shims: true,
  entry: [
    'src/index.ts',
  ],
})
