import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_TOML } from '@/constants'
import { parserToml, pluginToml } from '@/plugins'

export async function toml(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    files = [GLOB_TOML],
  } = options

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      files,
      name: 'xat/toml',
      plugins: {
        toml: pluginToml,
      },
      languageOptions: {
        parser: parserToml,
      },
      rules: {
        'toml/keys-order': 'error',

        'toml/comma-style': 'error',
        'toml/tables-order': 'error',
        'style/spaced-comment': 'off',
        'toml/no-space-dots': 'error',
        'toml/precision-of-integer': 'error',
        'toml/no-unreadable-number-separator': 'error',
        'toml/precision-of-fractional-seconds': 'error',

        'toml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'toml/key-spacing': 'error',
              'toml/quoted-keys': 'error',
              'toml/spaced-comment': 'error',
              'toml/array-bracket-newline': 'error',
              'toml/array-bracket-spacing': 'error',
              'toml/array-element-newline': 'error',
              'toml/table-bracket-spacing': 'error',
              'toml/inline-table-curly-spacing': 'error',
              'toml/padding-line-between-pairs': 'error',
              'toml/padding-line-between-tables': 'error',
              'toml/indent': ['error', indent === 'tab' ? 2 : indent],
            }
          : {},

        ...overrides,
      },
    },
  ]
}
