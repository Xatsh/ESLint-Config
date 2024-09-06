import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { astro, imports, javascript, jsdoc, jsonc, jsx, node, perfectionist, react, regexp, solid, sortPackageJson, stylistic, svelte, test, toml, typescript, unicorn, unocss, vue, yaml } from '@/configs'
import { combine } from '@/utils'

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
  solid(),
  sortPackageJson(),
  stylistic(),
  svelte(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  vue(),
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
