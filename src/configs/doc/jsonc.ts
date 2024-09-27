import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '@/constants'
import { parserJsonc, pluginJsonc } from '@/plugins'

export async function jsonc(
  options: OptionsFiles & OptionsStylistic & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
  } = options

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      files,
      name: 'xat/jsonc',
      plugins: {
        jsonc: pluginJsonc,
      },
      languageOptions: {
        parser: parserJsonc,
      },
      rules: {
        'jsonc/no-nan': 'error',
        'jsonc/no-octal': 'error',
        'jsonc/no-infinity': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/no-multi-str': 'error',
        'jsonc/no-plus-sign': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-octal-escape': 'error',
        'jsonc/space-unary-ops': 'error',
        'jsonc/no-parenthesized': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-useless-escape': 'error',
        'jsonc/valid-json-number': 'error',
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-regexp-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-floating-decimal': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-octal-numeric-literals': 'error',
        'jsonc/no-binary-numeric-literals': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/no-hexadecimal-numeric-literals': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'jsonc/quotes': 'error',
              'jsonc/quote-props': 'error',
              'jsonc/indent': ['error', indent],
              'jsonc/comma-style': ['error', 'last'],
              'jsonc/comma-dangle': ['error', 'never'],
              'jsonc/array-bracket-spacing': ['error', 'never'],
              'jsonc/object-curly-spacing': ['error', 'always'],
              'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false }],
              'jsonc/object-curly-newline': ['error', { multiline: true, consistent: true }],
              'jsonc/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
            }
          : {},

        ...overrides,
      },
    },
  ]
}
