import { GLOB_EXCLUDE } from '@/constants'
import type { TypedFlatConfigItem } from '@/types'

export async function ignore(userIgnores: string[] = []): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ignores: [
        ...GLOB_EXCLUDE,
        ...userIgnores,
      ],
      name: 'xat/ignore',
    },
  ]
}
