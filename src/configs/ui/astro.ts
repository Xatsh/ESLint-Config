import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '@/types'

import { GLOB_ASTRO, GLOB_ASTRO_SCRIPT } from '@/constants'
import { parserAstro, parserTs, pluginAstro } from '@/plugins'

export async function astro(
  options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_ASTRO],
    overrides = {},
    stylistic = true,
  } = options

  return [
    {
      name: 'xat/astro/setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files: [GLOB_ASTRO_SCRIPT],
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: parserTs,
        },
        sourceType: 'module',
      },
      name: 'xat/astro/script',
      processor: 'astro/client-side-ts',
    },
    {
      files,
      languageOptions: {
        globals: {
          ...pluginAstro.environments.astro.globals,
        },
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: parserTs,
          sourceType: 'module',
        },
      },
      name: 'xat/astro/rules',
      rules: {
        'astro/missing-client-only-directive-value': 'error',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-set-html-directive': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/sort-attributes': 'error',
        'astro/valid-compile': 'error',

        'perfectionist/sort-astro-attributes': [
          'error',
          {
            groups: [
              'multiline',
              'shorthand',
              'astro-shorthand',
              'unknown',
            ],
            order: 'asc',
            type: 'natural',
          },
        ],

        ...(stylistic
          ? {
              '@stylistic/indent': [
                'error',
                (typeof stylistic !== 'boolean' && stylistic.indent)
                  ? stylistic.indent
                  : 2,
              ],
              '@stylistic/jsx-closing-tag-location': 'off',
              '@stylistic/jsx-one-expression-per-line': 'off',
              '@stylistic/no-multiple-empty-lines': 'off',
            }
          : {}),

        ...overrides,
      },
    },
  ]
}
