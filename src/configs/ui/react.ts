import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '@/types'

import { isPackageExists } from 'local-pkg'

import { GLOB_SRC } from '@/constants'
import { parserTs, pluginReact, pluginReactHooks, pluginReactRefresh } from '@/plugins'
import { toArray } from '@/utils'

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  'vite',
]
const RemixPackages = [
  '@remix-run/node',
  '@remix-run/react',
  '@remix-run/serve',
  '@remix-run/dev',
]
const NextJsPackages = [
  'next',
]

export async function react(
  options: OptionsFiles & OptionsOverrides & OptionsTypeScriptWithTypes = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    files = [GLOB_SRC],
  } = options

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined
  const isTypeAware = !!tsconfigPath

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i))
  const isUsingRemix = RemixPackages.some(i => isPackageExists(i))
  const isUsingNext = NextJsPackages.some(i => isPackageExists(i))

  const plugins = pluginReact.configs.all.plugins

  return [
    {
      name: 'xat/react/setup',
      plugins: {
        'react-hooks': pluginReactHooks,
        'react': plugins['@eslint-react'],
        'react-refresh': pluginReactRefresh,
        'react-dom': plugins['@eslint-react/dom'],
        'react-hooks-extra': plugins['@eslint-react/hooks-extra'],
        'react-naming-convention': plugins['@eslint-react/naming-convention'],
      },
    },
    {
      files,
      name: 'xat/react/rules',
      languageOptions: {
        parser: parserTs,
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...isTypeAware ? { project: tsconfigPath } : {},
        },
      },
      rules: {
        'react/no-create-ref': 'error',
        'react/no-children-map': 'warn',
        'react/no-missing-key': 'error',
        'react/no-string-refs': 'error',
        'react/no-unused-state': 'warn',
        'react/no-children-only': 'warn',
        'react/no-children-prop': 'warn',
        'react/no-clone-element': 'warn',
        'react/no-implicit-key': 'error',
        'react-dom/no-namespace': 'error',
        'react-dom/no-script-url': 'warn',

        'react/no-children-count': 'warn',
        'react/no-duplicate-key': 'error',

        'react/no-array-index-key': 'warn',

        'react/no-useless-fragment': 'warn',
        'react/no-children-for-each': 'warn',
        'react/no-children-to-array': 'warn',
        'react/no-comment-textnodes': 'warn',
        'react/no-nested-components': 'warn',
        'react-dom/no-find-dom-node': 'error',
        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react/no-component-will-mount': 'error',
        'react/prefer-shorthand-boolean': 'warn',
        'react/no-component-will-update': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/prefer-shorthand-fragment': 'warn',
        'react-dom/no-missing-button-type': 'warn',
        'react-dom/no-unsafe-target-blank': 'warn',
        'react/no-unstable-context-value': 'error',
        'react/no-unstable-default-props': 'error',
        'react-dom/no-render-return-value': 'error',
        'react-dom/no-unsafe-iframe-sandbox': 'warn',
        // recommended rules from @eslint-react
        'react/ensure-forward-ref-using-ref': 'warn',
        'react/no-access-state-in-setstate': 'error',
        'react-dom/no-missing-iframe-sandbox': 'warn',
        'react/no-unsafe-component-will-mount': 'warn',
        'react/no-unsafe-component-will-update': 'warn',
        'react/prefer-destructuring-assignment': 'warn',
        'react-dom/no-dangerously-set-innerhtml': 'warn',
        'react/no-component-will-receive-props': 'error',
        'react/no-unused-class-component-members': 'warn',
        'react/no-set-state-in-component-did-mount': 'warn',
        // recommended rules from @eslint-react/dom
        'react-dom/no-children-in-void-dom-elements': 'warn',
        'react/no-set-state-in-component-did-update': 'warn',
        'react/no-redundant-should-component-update': 'error',
        'react/no-set-state-in-component-will-update': 'warn',
        'react/no-unsafe-component-will-receive-props': 'warn',
        'react-dom/no-dangerously-set-innerhtml-with-children': 'error',
        // react refresh
        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'config',
                    'generateStaticParams',
                    'metadata',
                    'generateMetadata',
                    'viewport',
                    'generateViewport',
                  ]
                : []),
              ...(isUsingRemix
                ? [
                    'meta',
                    'links',
                    'headers',
                    'loader',
                    'action',
                  ]
                : []),
            ],
          },
        ],

        ...isTypeAware
          ? {
              'react/no-leaked-conditional-rendering': 'warn',
            }
          : {},

        // overrides
        ...overrides,
      },
    },
  ]
}
