import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '@/types'

import { GLOB_HTML } from '@/constants'
import { parserHtml, pluginHtml } from '@/plugins'

export async function html(
  options: OptionsFiles & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_HTML],
    overrides = {},
  } = options

  const rules = {
    ...pluginHtml.configs['flat/recommended'].rules,
  }

  return [
    {
      files,
      languageOptions: {
        parser: parserHtml,
      },
      name: 'xat/html',
      plugins: {
        '@html-eslint': pluginHtml,
      },
      rules: {
        ...rules,
        ...overrides,
      },
    },
  ]
}
