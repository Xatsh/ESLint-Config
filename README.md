# @xats/eslint-config

[![npm](https://img.shields.io/npm/v/@xats/eslint-config?color=444&label=)](https://npmjs.com/package/@xats/eslint-config)
[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)


> Base on [Antfu's ESLint config preset](https://github.com/antfu/eslint-config)
> 
> Inspired by [Hyoban's ESLint config preset](https://github.com/hyoban/eslint-config-hyoban)

All in One ESLint config.

- Auto fix for formatting (**without** Prettier)
- [Auto detect](#auto-detect) your codebase and enable needed rules
- Work with React, Vue, Svelte, Solid, Astro.
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+

## Usage

1. Install by your package manager

npm
```shell
npm install -D eslint @xats/eslint-config
```

pnpm:
```shell
pnpm add -D eslint @xats/eslint-config
```

yarn:
```shell
yarn add -D eslint @xats/eslint-config
```

bun:
```shell
bun add -D eslint @xats/eslint-config
```

2. Create a `eslint.config.js` if your package.json set `"type": "module"`, otherwise create a `eslint.config.mjs`

```js
// eslint.config.js or eslint.config.mjs

import { xat } from '@xats/eslint-config'

export default xat()
```

3. Add scripts for `package.json`

For example:
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

4. VS Code - Auto fix on save (Optional)

<details>
<summary>Copied from antfu</summary>

```json
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```
</details>

## All Plugins

See `package.json`'s [dependencies list](https://github.com/Xats-Lab/eslint-config/blob/main/package.json)

## Auto-detect

This config will look up your `package.json`, and auto enable blow config rules

### UI

- Astro: `astro` dependency
- React: `react` dependency
- Vue: one of `vue`, `nuxt`, `vitepress`, `@slidev/cli`
- Svelte: `svelte` dependency
- SolidJS: `solid` dependency

### Style

- UnoCSS: `unocss` dependency
- TailwindCSS: `tailwindcss` dependency

### Devtool

- TypeScript: `typescript` dependency


## Customization

[ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) give us power to customize config.

Normally you only need to import the `xat` preset:

```js
// eslint.config.js
import { xat } from '@xats/eslint-config'

export default xat()
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import { xat } from '@xats/eslint-config'

export default xat({
  // Type of the project.
  // @default: 'app'
  type: 'lib', // 'app' | 'lib'
  
  // Enable stylistic formatting rules
  // Or customize the stylistic rules by give an object
  // @default: 'true'
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // Disable some items
  jsonc: false,
  yaml: false,
  
  // You can also disable some autodetected configs
  react: false,
  vue: false

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/fixtures',
    // ...globs
  ]
})
```

The `antfu`... sorry, I mean `xat` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import { xat } from '@antfu/eslint-config'

export default xat(
  {
    // Configures for xat's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

So Let's make a config only for `Astro` and `Vue`:

```js
// eslint.config.js
import {
  combine,
  astro, // Astro
  disable, // Disable some rules by default
  ignore, // ignore files in `.gitignore`
  javascript, // lol, u may need it
  typescript, // u may also need this one
  vue, // Vue
} from '@xats/eslint-config'

export default combine(
  astro(/* Options */),
  disable(/* Options */),
  ignores(/* Options */),
  javascript(/* Options */),
  typescript(/* Options */),
  vue(/* Options */),
  {
    files: ['**/*.ts'],
    rules: {},
  },
)
```

Yep, you can also make this to your personal config preset.

</details>

Check out the [configs](https://github.com/Xats-Lab/eslint-config/blob/main/src/configs) and [factory](https://github.com/Xats-Lab/eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-x/*`           | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                  |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> About plugin renaming - it is actually rather a dangrous move that might leading to potential naming collisions, pointed out [here](https://github.com/eslint/eslint/discussions/17766) and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat). As this config also very **personal** and **opinionated**, I ambitiously position this config as the only **"top-level"** config per project, that might pivots the taste of how rules are named.
>
> This config cares more about the user-facings DX, and try to ease out the implementation details. For example, users could keep using the semantic `import/order` without ever knowing the underlying plugin has migrated twice to `eslint-plugin-i` and then to `eslint-plugin-import-x`. User are also not forced to migrate to the implicit `i/order` halfway only because we swapped the implementation to a fork.
>
> That said, it's probably still not a good idea. You might not want to doing this if you are maintaining your own eslint config.
>
> Feel free to open issues if you want to combine this config with some other config presets but faced naming collisions. I am happy to figure out a way to make them work. But at this moment I have no plan to revert the renaming.

This preset will automatically rename the plugins also for your custom configs. You can use the original prefix to override the rules directly.

<details>
<summary>Change back to original prefix</summary>

If you really want to use the original prefix, you can revert the plugin renaming by:

```ts
import { xat } from '@xats/eslint-config'

export default xat()
  .renamePlugins({
    ts: '@typescript-eslint',
    yaml: 'yml',
    node: 'n'
    // ...
  })
```

</details>

### Rules Overrides

We provided the `overrides` options in each integration:

```js
// eslint.config.js
import { xat } from '@xat/eslint-config'

export default xat({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
})
```

### Config Composer

The factory function `xat()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import { xat } from '@xats/eslint-config'

export default xat()
  .prepend(
    // some configs before the main config
  )
  // overrides any named configs
  .override(
    'xats/imports',
    {
      rules: {
        'import/order': ['error', { 'newlines-between': 'always' }],
      }
    }
  )
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  })
// ...
```

## License

[MIT](./LICENSE) License &copy; 2024-PRESENT [Xat](https://github.com/Xatloon)
