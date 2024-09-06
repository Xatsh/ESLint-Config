import { GLOB_SRC, GLOB_SRC_EXT } from '@/constants'
import type { TypedFlatConfigItem } from '@/types'

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`scripts/${GLOB_SRC}`],
      name: 'xat/disables/scripts',
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
        'unicorn/consistent-function-scoping': 'off',
      },
    },
    {
      files: [`cli/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
      name: 'xat/disables/cli',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'xat/disables/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.([tj])s?(x)'],
      name: 'xat/disables/test',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'xat/disables/cjs',
      rules: {
        'ts/no-require-imports': 'off',
      },
    },
  ]
}
