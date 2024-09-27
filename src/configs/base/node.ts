import type { TypedFlatConfigItem } from '@/types'

import { pluginNode } from '@/plugins'

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'xat/node',
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/process-exit-as-throw': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/handle-callback-err': ['error', '^(err|error)$'],
      },
    },
  ]
}
