# @xats/eslint-config

[![npm](https://img.shields.io/npm/v/@xats/eslint-config?color=444&label=)](https://npmjs.com/package/@xats/eslint-config)
![code style](https://antfu.me/badge-code-style.svg)


> Base on [Antfu's ESLint config preset](https://github.com/antfu/eslint-config)
> 
> Inspired by [Hyoban's ESLint config preset](https://github.com/hyoban/eslint-config-hyoban)

All in One ESLint config.

![Icons](https://skillicons.dev/icons?i=js,ts,react,astro,tailwind)

## Features

- Auto fix for formatting (**without** Prettier)
- [Auto detect](#auto-detect) your codebase and enable needed rules
- Out of box level's support `toml`, `yaml`, `json`, `html`
- Work with **React, Astro**
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+

## Usage

1. Install by your package manager

```shell
npm install -D eslint @xats/eslint-config
```
```shell
pnpm add -D eslint @xats/eslint-config
```
```shell
yarn add -D eslint @xats/eslint-config
```
```shell
bun add -D eslint @xats/eslint-config
```

2. Create a `eslint.config.js` if your package.json set `"type": "module"`, otherwise create a `eslint.config.mjs`

```js
// eslint.config.js 
// or eslint.config.mjs

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
    { "rule": "@stylistic/*", "severity": "off", "fixable": true },
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
    "json",
    "jsonc",
    "yaml",
    "toml",
    "html",
    "astro",
  ]
}
```
</details>

## All Plugins

See `package.json`'s [dependencies list](https://github.com/Xats-Lab/eslint-config/blob/main/package.json)

## Auto-detect

This config will look up your `package.json`, and auto enable related config rules

### UI

- Astro: `astro`
- React: `react`

### Style

- UnoCSS: `unocss`
- TailwindCSS: `tailwindcss`

### Devtool

- TypeScript: `typescript`

## All Plugins

⚡️: Auto detect

👍🏻: Enabled default

🔧: Default disabled, need turn on manually.

<details>

<summary>
That's all plugins and its status
</summary>

### Base - you can **not** disable this configs, but you can still disable individual rule

- [eslint-plugin-n](https://www.npmjs.com/package/eslint-plugin-n)
- [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc)
- [eslint-plugin-import-x]( https://www.npmjs.com/package/eslint-plugin-import-x)
- [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports)
- [eslint-plugin-perfectionist](https://www.npmjs.com/package/eslint-plugin-perfectionist)
- [eslint-config-flat-gitignore](https://www.npmjs.com/package/eslint-config-flat-gitignore)

### Astro

- [eslint-plugin-astro](https://www.npmjs.com/package/eslint-plugin-astro) - ⚡️

### React

- [@eslint-react/eslint-plugin](https://npmjs.com/package/@eslint-react/eslint-plugin) - ⚡️
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) - ⚡️
- [eslint-plugin-react-refresh](https://www.npmjs.com/package/eslint-plugin-react-refresh) - ⚡️

### Style

- [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss) - ⚡️
- [@unocss/eslint-plugin](https://www.npmjs.com/package/@unocss/eslint-plugin) - ⚡️

### Devtools

- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) - ⚡️

### Document

- [eslint-plugin-jsonc](https://www.npmjs.com/package/eslint-plugin-jsonc) - 👍🏻 `jsonc`
- [eslint-plugin-toml](https://www.npmjs.com/package/eslint-plugin-toml) - 👍🏻 `toml`
- [eslint-plugin-yml](https://www.npmjs.com/package/eslint-plugin-yml) - 👍🏻 `yaml`

### Miscs

- [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin) - 👍🏻 `stylistic`
- [eslint-plugin-regexp](https://www.npmjs.com/package/eslint-plugin-regexp) - 👍🏻 `regexp`
- [eslint-plugin-unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn)  - 👍🏻 `unicorn`

</details>

## Customization

[ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) give us power to customize config.

Normally you only need to import the `xat` preset:

```js
// eslint.config.js
import { xat } from '@xats/eslint-config'

export default xat()
```

And that's it! Or you can configure each integration individually, this is an all options example:

```js
// eslint.config.js
import { xat } from '@xats/eslint-config'

export default xat({
  // Type of the project.
  // set to 'lib' will enable stricter rules
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
  toml: false,
  unicorn: false,
  
  // You can also disable some autodetected configs
  react: false,
  astro: false,
  typescript: false,
  tailwind: false,
  unocss: false,

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

Check out the [configs](https://github.com/Xats-Lab/eslint-config/blob/main/src/configs) and [factory](https://github.com/Xats-Lab/eslint-config/blob/main/src/factory.ts) for more details.

By the way, this config is based on `@antfu/eslint-config@3.5.0`, So you can reference it's [Customization section](https://github.com/antfu/eslint-config/tree/v3.5.0#Customization).

## License

[MIT](./LICENSE) License &copy; 2024-PRESENT [Xat](https://github.com/Xatloon)
