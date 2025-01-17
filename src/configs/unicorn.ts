import type { TypedFlatConfigItem } from "@/types"

import { pluginUnicorn } from "@/plugins"

export async function unicorn(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: "xat/unicorn",
			plugins: {
				unicorn: pluginUnicorn,
			},
			rules: {
				...pluginUnicorn.configs["flat/recommended"].rules,
				"unicorn/prevent-abbreviations": [
					"error",
					{
						allowList: {
							generateStaticParams: true,
						},
					},
				],
			},
		},
	]
}
