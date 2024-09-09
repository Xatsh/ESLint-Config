import { pluginTailwindCSS } from '@/plugins'
import type { OptionsOverrides, TypedFlatConfigItem } from '@/types'

export async function tailwindcss(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const config = pluginTailwindCSS.configs['flat/recommended'] as TypedFlatConfigItem

  const rules = {
    ...config.rules,
  }

  return [
    {
      ...config,
      name: 'xat/tailwindcss/rules',
      rules: {
        ...rules,
        ...overrides,
      },
    },
  ]
}
