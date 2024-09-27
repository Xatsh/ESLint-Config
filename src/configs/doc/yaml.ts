import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_YAML } from '@/constants'
import { parserYaml, pluginYaml } from '@/plugins'

export async function yaml(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    files = [GLOB_YAML],
  } = options

  const {
    indent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      files,
      name: 'xat/yaml',
      plugins: {
        yaml: pluginYaml,
      },
      languageOptions: {
        parser: parserYaml,
      },
      rules: {
        'yaml/no-empty-key': 'error',

        'yaml/plain-scalar': 'error',
        'style/spaced-comment': 'off',
        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'yaml/key-spacing': 'error',
              'yaml/no-tab-indent': 'error',
              'yaml/spaced-comment': 'error',
              'yaml/flow-mapping-curly-newline': 'error',
              'yaml/flow-mapping-curly-spacing': 'error',
              'yaml/flow-sequence-bracket-newline': 'error',
              'yaml/flow-sequence-bracket-spacing': 'error',
              'yaml/block-sequence-hyphen-indicator-newline': 'error',
              'yaml/indent': ['error', indent === 'tab' ? 2 : indent],
              'yaml/block-mapping-question-indicator-newline': 'error',
              'yaml/quotes': ['error', { prefer: quotes, avoidEscape: false }],
            }
          : {},

        ...overrides,
      },
    },
  ]
}
