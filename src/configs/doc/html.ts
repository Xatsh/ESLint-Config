import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_HTML } from '@/constants'
import { parserHtml, pluginHtml } from '@/plugins'

export async function html(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_HTML],
    overrides = {},
    stylistic = true,
  } = options

  const rules = {
    ...pluginHtml.configs['flat/recommended'].rules,
  }

  const {
    indent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic

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
        '@stylistic/spaced-comment': 'off',

        ...rules,

        '@html-eslint/attrs-newline': 'off',
        '@html-eslint/element-newline': 'off',
        '@html-eslint/indent': 'off',
        '@html-eslint/no-extra-spacing-attrs': 'off',
        '@html-eslint/quotes': 'off',

        ...stylistic
          ? {
              '@html-eslint/attrs-newline': 'error',
              '@html-eslint/element-newline': 'error',
              '@html-eslint/indent': ['error', indent],
              '@html-eslint/lowercase': 'error',
              '@html-eslint/no-extra-spacing-attrs': 'error',
              '@html-eslint/no-multiple-empty-lines': 'error',
              '@html-eslint/no-trailing-spaces': 'error',
              '@html-eslint/quotes': ['error', quotes],
              '@html-eslint/sort-attrs': 'error',
            }
          : {},

        ...overrides,
      },
    },
  ]
}
