import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, OptionsProjectType, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from "@/types"

import process from "node:process"

import { GLOB_TS, GLOB_TSX } from "@/constants"
import { parserTs, pluginTs } from "@/plugins"

export async function typescript(
	options: OptionsFiles & OptionsOverrides & OptionsProjectType & OptionsComponentExts & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		componentExts = [],
		overrides = {},
		overridesTypeAware = {},
		parserOptions = {},
		type = "app",
	} = options

	const files = options.files ?? [
		GLOB_TS,
		GLOB_TSX,
		...componentExts.map(ext => `**/*.${ext}`),
	]

	const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
	const ignoresTypeAware = options.ignoresTypeAware ?? []
	const tsconfigPath = options?.tsconfigPath
		? options.tsconfigPath
		: undefined
	const isTypeAware = !!tsconfigPath

	const typeAwareRules: TypedFlatConfigItem["rules"] = {
		"@typescript-eslint/await-thenable": "error",
		"@typescript-eslint/dot-notation": ["error", { allowKeywords: true }],
		"@typescript-eslint/no-floating-promises": "error",
		"@typescript-eslint/no-for-in-array": "error",
		"@typescript-eslint/no-implied-eval": "error",
		"@typescript-eslint/no-misused-promises": "error",
		"@typescript-eslint/no-unnecessary-type-assertion": "error",
		"@typescript-eslint/no-unsafe-argument": "error",
		"@typescript-eslint/no-unsafe-assignment": "error",
		"@typescript-eslint/no-unsafe-call": "error",
		"@typescript-eslint/no-unsafe-member-access": "error",
		"@typescript-eslint/no-unsafe-return": "error",
		"@typescript-eslint/promise-function-async": "error",
		"@typescript-eslint/restrict-plus-operands": "error",
		"@typescript-eslint/restrict-template-expressions": "error",
		"@typescript-eslint/return-await": ["error", "in-try-catch"],
		"@typescript-eslint/strict-boolean-expressions": ["error", { allowNullableBoolean: true, allowNullableObject: true }],
		"@typescript-eslint/switch-exhaustiveness-check": "error",
		"@typescript-eslint/unbound-method": "error",
		"dot-notation": "off",
		"no-implied-eval": "off",
	}

	function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
		return {
			files,
			...ignores ? { ignores } : {},
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					extraFileExtensions: componentExts.map(ext => `.${ext}`),
					sourceType: "module",
					...typeAware
						? {
								projectService: {
									allowDefaultProject: ["./*.js"],
									defaultProject: tsconfigPath,
								},
								tsconfigRootDir: process.cwd(),
							}
						: {},
					...parserOptions,
				},
			},
			name: `xat/typescript/${typeAware ? "type-aware-parser" : "parser"}`,
		}
	}

	return [
		{
			name: "xat/typescript/setup",
			plugins: {
				"@typescript-eslint": pluginTs,
			},
		},
		// assign type-aware parser for type-aware files and type-unaware parser for the rest
		...isTypeAware
			? [
					makeParser(false, files),
					makeParser(true, filesTypeAware, ignoresTypeAware),
				]
			: [
					makeParser(false, files),
				],
		{
			files,
			name: "xat/typescript/rules",
			rules: {
				...pluginTs.configs["eslint-recommended"].overrides![0].rules!,
				...pluginTs.configs.strict.rules!,

				"@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
				"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
				"@typescript-eslint/consistent-type-imports": ["error", {
					disallowTypeAnnotations: false,
					prefer: "type-imports",
				}],
				"@typescript-eslint/method-signature-style": ["error", "property"], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
				"@typescript-eslint/no-dupe-class-members": "error",
				"@typescript-eslint/no-dynamic-delete": "off",
				"@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "always" }],
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-extraneous-class": "off",
				"@typescript-eslint/no-import-type-side-effects": "error",
				"@typescript-eslint/no-invalid-void-type": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-redeclare": ["error", { builtinGlobals: false }],
				"@typescript-eslint/no-require-imports": "error",
				"@typescript-eslint/no-unused-expressions": ["error", {
					allowShortCircuit: true,
					allowTaggedTemplates: true,
					allowTernary: true,
				}],
				"@typescript-eslint/no-unused-vars": "off",
				"@typescript-eslint/no-use-before-define": ["error", { classes: false, functions: false, variables: true }],
				"@typescript-eslint/no-useless-constructor": "off",
				"@typescript-eslint/no-wrapper-object-types": "error",
				"@typescript-eslint/triple-slash-reference": "off",
				"@typescript-eslint/unified-signatures": "off",
				"no-dupe-class-members": "off",
				"no-redeclare": "off",
				"no-use-before-define": "off",
				"no-useless-constructor": "off",

				...(type === "lib"
					? {
							"@typescript-eslint/explicit-function-return-type": ["error", {
								allowExpressions: true,
								allowHigherOrderFunctions: true,
								allowIIFEs: true,
							}],
						}
					: {}
				),
				...overrides,
			},
		},
		...isTypeAware
			? [{
					files: filesTypeAware,
					ignores: ignoresTypeAware,
					name: "xat/typescript/rules-type-aware",
					rules: {
						...typeAwareRules,
						...overridesTypeAware,
					},
				}]
			: [],
	]
}
