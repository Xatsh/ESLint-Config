import type { TypedFlatConfigItem } from '@/types'

import { pluginPerfectionist } from '@/plugins'

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'xat/perfectionist',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-enums': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-objects': ['error', { order: 'asc', type: 'line-length' }],
        'perfectionist/sort-union-types': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-object-types': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-intersection-types': ['error', { order: 'asc', type: 'line-length' }],
        'perfectionist/sort-jsx-props': ['error', {
          order: 'asc',
          type: 'natural',
          groups: [
            'multiline',
            'shorthand',
            'unknown',
          ],
        }],
        'perfectionist/sort-imports': ['error', {
          order: 'asc',
          type: 'natural',
          newlinesBetween: 'always',
          internalPattern: [
            '~/**',
            '@/**',
            '#/**',
          ],
          groups: [
            'builtin-type',
            'external-type',
            ['parent-type', 'sibling-type', 'index-type', 'internal-type'],
            'builtin',
            'external',
            ['parent', 'sibling', 'index', 'internal'],
            ['side-effect', 'side-effect-style'],
            'object',
            'unknown',
          ],
        }],
      },
    },
  ]
}
