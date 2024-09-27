import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, OptionsProjectType, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '@/types'

import process from 'node:process'

import { GLOB_ASTRO_TS, GLOB_TS, GLOB_TSX } from '@/constants'
import { parserTs, pluginTs } from '@/plugins'
import { renameRules } from '@/utils'

export async function typescript(
  options: OptionsFiles & OptionsOverrides & OptionsProjectType & OptionsComponentExts & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    type = 'app',
    overrides = {},
    componentExts = [],
    parserOptions = {},
    overridesTypeAware = {},
  } = options

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map(ext => `**/*.${ext}`),
  ]

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    GLOB_ASTRO_TS,
  ]
  const tsconfigPath = options?.tsconfigPath
    ? options.tsconfigPath
    : undefined
  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/unbound-method': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-floating-promises': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/switch-exhaustiveness-check': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/strict-boolean-expressions': ['error', { allowNullableObject: true, allowNullableBoolean: true }],
  }

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      files,
      ...ignores ? { ignores } : {},
      name: `xat/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          sourceType: 'module',
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          ...typeAware
            ? {
                tsconfigRootDir: process.cwd(),
                projectService: {
                  defaultProject: tsconfigPath,
                  allowDefaultProject: ['./*.js'],
                },
              }
            : {},
          ...parserOptions as any,
        },
      },
    }
  }

  return [
    {
      name: 'xat/typescript/setup',
      plugins: {
        ts: pluginTs,
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
      name: 'xat/typescript/rules',
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          { '@typescript-eslint': 'ts' },
        ),
        ...renameRules(
          pluginTs.configs.strict.rules!,
          { '@typescript-eslint': 'ts' },
        ),
        'no-redeclare': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-explicit-any': 'off',
        'no-use-before-define': 'off',
        'ts/no-dynamic-delete': 'off',
        'no-dupe-class-members': 'off',
        'ts/unified-signatures': 'off',
        'no-useless-constructor': 'off',
        'ts/no-extraneous-class': 'off',
        'ts/no-invalid-void-type': 'off',
        'ts/no-require-imports': 'error',
        'ts/no-non-null-assertion': 'off',
        'ts/no-useless-constructor': 'off',
        'ts/triple-slash-reference': 'off',
        'ts/no-dupe-class-members': 'error',
        'ts/no-wrapper-object-types': 'error',
        'ts/no-import-type-side-effects': 'error',
        'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        'ts/no-redeclare': ['error', { builtinGlobals: false }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
        'ts/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
        'ts/no-use-before-define': ['error', { classes: false, variables: true, functions: false }],
        'ts/consistent-type-imports': ['error', {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        }],
        'ts/no-unused-expressions': ['error', {
          allowTernary: true,
          allowShortCircuit: true,
          allowTaggedTemplates: true,
        }],

        ...(type === 'lib'
          ? {
              'ts/explicit-function-return-type': ['error', {
                allowIIFEs: true,
                allowExpressions: true,
                allowHigherOrderFunctions: true,
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
          name: 'xat/typescript/rules-type-aware',
          rules: {
            ...typeAwareRules,
            ...overridesTypeAware,
          },
        }]
      : [],
  ]
}
