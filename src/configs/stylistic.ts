import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "@/types"

import { pluginStylistic } from "@/plugins"

export async function stylistic(
	options: StylisticConfig & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		indent = "tab",
		jsx,
		overrides = {},
		quotes = "double",
		semi = false,
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
			name: "xat/stylistic",
			plugins: {
				"@stylistic": pluginStylistic,
			},
			rules: {
				...config.rules,
				...overrides,
			},
		},
	]
}
