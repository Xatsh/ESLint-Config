import { GLOB_SRC, GLOB_SRC_EXT } from '@/constants'
import type { TypedFlatConfigItem } from '@/types'

export async function disable(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`scripts/${GLOB_SRC}`],
      name: 'xat/disable/scripts',
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
      },
    },
    {
      files: [`cli/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
      name: 'xat/disable/cli',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'xat/disable/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.([tj])s?(x)'],
      name: 'xat/disable/test',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'xat/disable/cjs',
      rules: {
        'ts/no-require-imports': 'off',
      },
    },
  ]
}
