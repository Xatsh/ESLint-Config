import type { Linter } from "eslint"

import type { Awaitable, ConfigNames, OptionsConfig, Rules, TypedFlatConfigItem } from "@/types"

import { FlatConfigComposer } from "eslint-flat-config-utils"
import { isPackageExists } from "local-pkg"

import {
	astro,
	disable,
	ignore,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	node,
	perfectionist,
	react,
	regexp,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	tailwindcss,
	toml,
	typescript,
	unicorn,
	unocss,
	yaml } from "@/configs"
import { interopDefault, isInEditor } from "@/utils"

const flatConfigProps = [
	"name",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings",
] satisfies (keyof TypedFlatConfigItem)[]

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function xat(
	options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
	...userConfigs: Awaitable<FlatConfigComposer<any, any> | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const {
		astro: enableAstro = isPackageExists("astro"),
		componentExts = [],
		gitignore: enableGitignore = true,
		jsonc: enableJsonc = true,
		jsx: enableJsx = true,
		react: enableReact = isPackageExists("react"),
		regexp: enableRegexp = true,
		tailwindcss: enableTailwindCSS = isPackageExists("tailwindcss"),
		toml: enableToml = true,
		typescript: enableTypeScript = isPackageExists("typescript"),
		unicorn: enableUnicorn = true,
		unocss: enableUnoCSS = isPackageExists("unocss"),
		yaml: enableYaml = true,
	} = options

	let isEditor = options.isInEditor
	if (isEditor == null) {
		isEditor = isInEditor()
		if (isEditor)
		// eslint-disable-next-line no-console
			console.log("[@xats/eslint-config] Detected running in editor, some rules are disabled.")
	}

	const stylisticOptions = options.stylistic === false
		? false
		: typeof options.stylistic === "object"
			? options.stylistic
			: {}

	if (stylisticOptions && !("jsx" in stylisticOptions))
		stylisticOptions.jsx = enableJsx

	const configs: Awaitable<TypedFlatConfigItem[]>[] = []

	if (enableGitignore) {
		if (typeof enableGitignore !== "boolean") {
			configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r({
				name: "xat/gitignore",
				...enableGitignore,
			})]))
		}
		else {
			configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r({
				name: "xat/gitignore",
				strict: false,
			})]))
		}
	}

	const typescriptOptions = resolveSubOptions(options, "typescript")
	const tsconfigPath = "tsconfigPath" in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

	// Base configs
	configs.push(
		ignore(options.ignores),
		javascript({
			isInEditor: isEditor,
			overrides: getOverrides(options, "javascript"),
		}),
		node(),
		jsdoc({
			stylistic: stylisticOptions,
		}),
		imports({
			stylistic: stylisticOptions,
		}),
		perfectionist(),
	)

	if (enableUnicorn) {
		configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn))
	}

	if (enableJsx) {
		configs.push(jsx())
	}

	if (enableTypeScript) {
		configs.push(typescript({
			...typescriptOptions,
			componentExts,
			overrides: getOverrides(options, "typescript"),
			type: options.type,
		}))
	}

	if (stylisticOptions) {
		configs.push(stylistic({
			...stylisticOptions,
			overrides: getOverrides(options, "stylistic"),
		}))
	}

	if (enableTailwindCSS) {
		configs.push(tailwindcss({
			overrides: getOverrides(options, "tailwindcss"),
		}))
	}

	if (enableRegexp) {
		configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp))
	}

	if (enableReact) {
		configs.push(react({
			overrides: getOverrides(options, "react"),
			tsconfigPath,
		}))
	}

	if (enableUnoCSS) {
		configs.push(unocss({
			...resolveSubOptions(options, "unocss"),
			overrides: getOverrides(options, "unocss"),
		}))
	}

	if (enableAstro) {
		configs.push(astro({
			overrides: getOverrides(options, "astro"),
			stylistic: stylisticOptions,
		}))
	}

	if (enableJsonc) {
		configs.push(
			jsonc({
				overrides: getOverrides(options, "jsonc"),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsconfig(),
		)
	}

	if (enableYaml) {
		configs.push(yaml({
			overrides: getOverrides(options, "yaml"),
			stylistic: stylisticOptions,
		}))
	}

	if (enableToml) {
		configs.push(toml({
			overrides: getOverrides(options, "toml"),
			stylistic: stylisticOptions,
		}))
	}

	configs.push(
		disable(),
	)

	if ("files" in options) {
		throw new Error("[@xats/eslint-config] The first argument should not contain the \"files\" property as the options are supposed to be global. Place it in the second or later config instead.")
	}

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig = flatConfigProps.reduce((acc, key) => {
		if (key in options)
			acc[key] = options[key] as any
		return acc
	}, {} as TypedFlatConfigItem)
	if (Object.keys(fusedConfig).length)
		configs.push([fusedConfig])

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

	composer = composer
		.append(
			...configs,
			...userConfigs as any,
		)

	return composer
}

export type ResolvedOptions<T> = T extends boolean
	? never
	: NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolvedOptions<OptionsConfig[K]> {
	return typeof options[key] === "boolean"
		? {} as any
		: options[key] || {}
}

export function getOverrides<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): Partial<Rules & Linter.RulesRecord> {
	const sub = resolveSubOptions(options, key)
	return {
		..."overrides" in sub
			? sub.overrides
			: {},
	}
}
