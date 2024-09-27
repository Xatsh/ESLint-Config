import fs from 'node:fs/promises'
import { astro, imports, javascript, jsdoc, jsonc, jsx, node, perfectionist, react, regexp, sortPackageJson, stylistic, tailwindcss, toml, typescript, unicorn, unocss, yaml } from '@/configs'
import { combine } from '@/utils'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'

const configs = await combine(
  astro(),
  imports(),
  javascript(),
  jsx(),
  jsdoc(),
  jsonc(),
  node(),
  perfectionist(),
  react(),
  sortPackageJson(),
  stylistic(),
  tailwindcss(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  yaml(),
)

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await fs.writeFile('src/types/modules/eslint.d.ts', dts)
