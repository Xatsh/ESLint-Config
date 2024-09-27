import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '@/types'

import { pluginStylistic } from '@/plugins'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  semi: false,
  quotes: 'single',
}

export async function stylistic(
  options: StylisticConfig & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    jsx,
    semi,
    indent,
    quotes,
    overrides = {},
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const config = pluginStylistic.configs.customize({
    jsx,
    semi,
    indent,
    quotes,
    flat: true,
    pluginName: 'style',
  })

  return [
    {
      name: 'xat/stylistic',
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
