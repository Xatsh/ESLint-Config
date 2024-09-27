import type { OptionsOverrides, OptionsRegExp, TypedFlatConfigItem } from '@/types'
import { pluginRegex } from '@/plugins'

export async function regexp(
  options: OptionsRegExp & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const config = pluginRegex.configs['flat/recommended'] as TypedFlatConfigItem

  const rules = {
    ...config.rules,
  }

  if (options.level === 'warn') {
    for (const key in rules) {
      if (rules[key] === 'error')
        rules[key] = 'warn'
    }
  }

  return [
    {
      ...config,
      name: 'xat/regexp',
      rules: {
        ...rules,
        ...options.overrides,
      },
    },
  ]
}
