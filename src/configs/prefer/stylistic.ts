import { pluginStylistic } from '@/plugins'
import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '@/types'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

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
    ...StylisticConfigDefaults,
    ...options,
  }

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  })

  return [
    {
      name: 'xat/stylistic/rules',
      plugins: {
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...overrides,
      },
    },
  ]
}
