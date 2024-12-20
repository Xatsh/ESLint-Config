import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from "@/types"

import { GLOB_TOML } from "@/constants"
import { parserToml, pluginToml } from "@/plugins"

export async function toml(
	options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		files = [GLOB_TOML],
		overrides = {},
		stylistic = true,
	} = options

	const {
		indent = 2,
	} = typeof stylistic === "boolean" ? {} : stylistic

	return [
		{
			files,
			languageOptions: {
				parser: parserToml,
			},
			name: "xat/toml",
			plugins: {
				toml: pluginToml,
			},
			rules: {
				"@stylistic/spaced-comment": "off",

				"toml/comma-style": "error",
				"toml/keys-order": "error",
				"toml/no-space-dots": "error",
				"toml/no-unreadable-number-separator": "error",
				"toml/precision-of-fractional-seconds": "error",
				"toml/precision-of-integer": "error",
				"toml/tables-order": "error",

				"toml/vue-custom-block/no-parsing-error": "error",

				...stylistic
					? {
							"toml/array-bracket-newline": "error",
							"toml/array-bracket-spacing": "error",
							"toml/array-element-newline": "error",
							"toml/indent": ["error", indent === "tab" ? 2 : indent],
							"toml/inline-table-curly-spacing": "error",
							"toml/key-spacing": "error",
							"toml/padding-line-between-pairs": "error",
							"toml/padding-line-between-tables": "error",
							"toml/quoted-keys": "error",
							"toml/spaced-comment": "error",
							"toml/table-bracket-spacing": "error",
						}
					: {},

				...overrides,
			},
		},
	]
}
