import type { TypedFlatConfigItem } from "@/types"

import { GLOB_SRC, GLOB_SRC_EXT } from "@/constants"

export async function disable(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			files: [`**/scripts/${GLOB_SRC}`],
			name: "xat/disable/scripts",
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
				"no-console": "off",
			},
		},
		{
			files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
			name: "xat/disable/cli",
			rules: {
				"no-console": "off",
			},
		},
		{
			files: ["**/*.d.?([cm])ts"],
			name: "xat/disable/dts",
			rules: {
				"import-x/no-duplicates": "off",
				"no-restricted-syntax": "off",
				"unused-imports/no-unused-vars": "off",
			},
		},
		{
			files: ["**/*.cjs"],
			name: "xat/disable/cjs",
			rules: {
				"@typescript-eslint/no-require-imports": "off",
			},
		},
		{
			files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
			name: "xat/disables/config-files",
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
				"no-console": "off",
			},
		},
	]
}
