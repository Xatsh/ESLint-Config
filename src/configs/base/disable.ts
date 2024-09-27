import type { TypedFlatConfigItem } from '@/types'

import { GLOB_SRC, GLOB_SRC_EXT } from '@/constants'

export async function disable(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'xat/disable/scripts',
      files: [`**/scripts/${GLOB_SRC}`],
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
      },
    },
    {
      name: 'xat/disable/cli',
      rules: {
        'no-console': 'off',
      },
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
    },
    {
      name: 'xat/disable/dts',
      files: ['**/*.d.?([cm])ts'],
      rules: {
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
      },
    },
    {
      name: 'xat/disable/test',
      files: ['**/*.{test,spec}.([tj])s?(x)'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      name: 'xat/disable/cjs',
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': 'off',
      },
    },
    {
      name: 'xat/disables/config-files',
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
      },
    },
  ]
}
