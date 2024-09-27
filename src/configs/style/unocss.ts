import type { OptionsUnoCSS, TypedFlatConfigItem } from '@/types'

import { pluginUnoCSS } from '@/plugins'

export async function unocss(
  options: OptionsUnoCSS = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    strict = false,
    attributify = true,
  } = options

  return [
    {
      name: 'xat/unocss',
      plugins: {
        unocss: pluginUnoCSS,
      },
      rules: {
        'unocss/order': 'warn',
        ...attributify
          ? {
              'unocss/order-attributify': 'warn',
            }
          : {},
        ...strict
          ? {
              'unocss/blocklist': 'error',
            }
          : {},
      },
    },
  ]
}
