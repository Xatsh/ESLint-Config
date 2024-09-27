import type { Linter } from 'eslint'

import type { Awaitable, ConfigNames, OptionsConfig, Rules, TypedFlatConfigItem } from '@/types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'

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
  yaml } from '@/configs'
import { interopDefault, isInEditor } from '@/utils'

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[]

export const defaultPluginRenaming = {
  'n': 'node',
  'yml': 'yaml',
  'import-x': 'import',
  '@stylistic': 'style',

  '@eslint-react': 'react',
  '@typescript-eslint': 'ts',
  '@eslint-react/dom': 'react-dom',
  '@eslint-react/hooks-extra': 'react-hooks-extra',
  '@eslint-react/naming-convention': 'react-naming-convention',
}

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
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<FlatConfigComposer<any, any> | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    componentExts = [],
    jsx: enableJsx = true,
    autoRenamePlugins = true,
    regexp: enableRegexp = true,
    unicorn: enableUnicorn = true,
    gitignore: enableGitignore = true,
    astro: enableAstro = isPackageExists('astro'),
    react: enableReact = isPackageExists('react'),
    unocss: enableUnoCSS = isPackageExists('unocss'),
    typescript: enableTypeScript = isPackageExists('typescript'),
    tailwindcss: enableTailwindCSS = isPackageExists('tailwindcss'),
  } = options

  let isEditor = options.isInEditor
  if (isEditor == null) {
    isEditor = isInEditor()
    if (isEditor)
      // eslint-disable-next-line no-console
      console.log('[@xats/eslint-config] Detected running in editor, some rules are disabled.')
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {}

  if (stylisticOptions && !('jsx' in stylisticOptions))
    stylisticOptions.jsx = enableJsx

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'xat/gitignore',
        ...enableGitignore,
      })]))
    }
    else {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        strict: false,
        name: 'xat/gitignore',
      })]))
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

  // Base configs
  configs.push(
    ignore(options.ignores),
    javascript({
      isInEditor: isEditor,
      overrides: getOverrides(options, 'javascript'),
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
      type: options.type,
      overrides: getOverrides(options, 'typescript'),
    }))
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }))
  }

  if (enableTailwindCSS) {
    configs.push(tailwindcss({
      overrides: getOverrides(options, 'tailwindcss'),
    }))
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (enableReact) {
    configs.push(react({
      tsconfigPath,
      overrides: getOverrides(options, 'react'),
    }))
  }

  if (enableUnoCSS) {
    configs.push(unocss({
      ...resolveSubOptions(options, 'unocss'),
      overrides: getOverrides(options, 'unocss'),
    }))
  }

  if (enableAstro) {
    configs.push(astro({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'astro'),
    }))
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        stylistic: stylisticOptions,
        overrides: getOverrides(options, 'jsonc'),
      }),
      sortPackageJson(),
      sortTsconfig(),
    )
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'yaml'),
    }))
  }

  if (options.toml ?? true) {
    configs.push(toml({
      stylistic: stylisticOptions,
      overrides: getOverrides(options, 'toml'),
    }))
  }

  configs.push(
    disable(),
  )

  if ('files' in options) {
    throw new Error('[@xats/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.')
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

  if (autoRenamePlugins) {
    composer = composer
      .renamePlugins(defaultPluginRenaming)
  }

  return composer
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {}
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Rules & Linter.RulesRecord> {
  const sub = resolveSubOptions(options, key)
  return {
    ...'overrides' in sub
      ? sub.overrides
      : {},
  }
}
