import type { TypedFlatConfigItem } from '@/types'

import { GLOB_EXCLUDE } from '@/constants'

export async function ignore(userIgnores: string[] = []): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'xat/ignore',
      ignores: [
        ...GLOB_EXCLUDE,
        ...userIgnores,
      ],
    },
  ]
}
