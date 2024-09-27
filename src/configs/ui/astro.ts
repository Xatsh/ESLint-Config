import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_ASTRO } from '@/constants'
import { parserAstro, parserTs, pluginAstro } from '@/plugins'

export async function astro(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    files = [GLOB_ASTRO],
  } = options

  return [
    {
      name: 'xat/astro/setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      name: 'xat/astro/rules',
      processor: 'astro/client-side-ts',
      languageOptions: {
        parser: parserAstro,
        sourceType: 'module',
        globals: pluginAstro.environments.astro.globals,
        parserOptions: {
          parser: parserTs,
          extraFileExtensions: ['.astro'],
        },
      },
      rules: {
        'astro/semi': 'off',
        'astro/valid-compile': 'error',
        'astro/no-set-html-directive': 'off',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        // use recommended rules
        'astro/missing-client-only-directive-value': 'error',

        'perfectionist/sort-astro-attributes': [
          'error',
          {
            order: 'asc',
            type: 'natural',
            groups: [
              'multiline',
              'shorthand',
              'astro-shorthand',
              'unknown',
            ],
          },
        ],

        ...stylistic
          ? {
              'style/indent': 'off',
              'style/no-multiple-empty-lines': 'off',
              'style/jsx-closing-tag-location': 'off',
              'style/jsx-one-expression-per-line': 'off',
            }
          : {},

        ...overrides,
      },
    },
  ]
}
