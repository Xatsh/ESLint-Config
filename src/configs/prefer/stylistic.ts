import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '@/types'

import { GLOB_HTML } from '@/constants'
import { pluginStylistic } from '@/plugins'

export async function stylistic(
  options: StylisticConfig & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...options,
  }

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    quotes,
    semi,
  })

  return [
    {
      ignores: [GLOB_HTML],
      name: 'xat/stylistic',
      plugins: {
        '@stylistic': pluginStylistic,
      },
      rules: {
        ...config.rules,
        ...overrides,
      },
    },
  ]
}
