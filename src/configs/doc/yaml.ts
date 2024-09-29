import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_YAML } from '@/constants'
import { parserYaml, pluginYaml } from '@/plugins'

export async function yaml(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_YAML],
    overrides = {},
    stylistic = true,
  } = options

  const {
    indent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: 'xat/yaml',
      plugins: {
        yml: pluginYaml,
      },
      rules: {
        '@stylistic/spaced-comment': 'off',

        'yml/block-mapping': 'error',
        'yml/block-sequence': 'error',
        'yml/no-empty-key': 'error',
        'yml/no-empty-sequence-entry': 'error',
        'yml/no-irregular-whitespace': 'error',
        'yml/plain-scalar': 'error',

        'yml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'yml/block-mapping-question-indicator-newline': 'error',
              'yml/block-sequence-hyphen-indicator-newline': 'error',
              'yml/flow-mapping-curly-newline': 'error',
              'yml/flow-mapping-curly-spacing': 'error',
              'yml/flow-sequence-bracket-newline': 'error',
              'yml/flow-sequence-bracket-spacing': 'error',
              'yml/indent': ['error', indent === 'tab' ? 2 : indent],
              'yml/key-spacing': 'error',
              'yml/no-tab-indent': 'error',
              'yml/quotes': ['error', { avoidEscape: false, prefer: quotes }],
              'yml/spaced-comment': 'error',
            }
          : {},

        ...overrides,
      },
    },
  ]
}
