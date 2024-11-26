# @xats/eslint-config

[![npm](https://img.shields.io/npm/v/@xats/eslint-config?color=444&label=)](https://npmjs.com/package/@xats/eslint-config)
![code style](https://antfu.me/badge-code-style.svg)

> Base on [Antfu's ESLint config preset](https://github.com/antfu/eslint-config)
>
> Inspired by [Hyoban's ESLint config preset](https://github.com/hyoban/eslint-config-hyoban)

All in One ESLint config.

![Icons](https://skillicons.dev/icons?i=js,ts,react,astro,tailwind)

## Features

- [Auto detect](#auto-detect) your codebase and enable needed rules
- Out of box level's support `toml`, `yaml`, `json`, `html`
- Work with **React, Astro**
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+

## Usage

Install by your package manager

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

Create a `eslint.config.js` if your package.json set `"type": "module"`, otherwise create a `eslint.config.mjs`
  
```js
// eslint.config.js 
// or eslint.config.mjs

import { xat } from '@xats/eslint-config'

export default xat()
```

Add scripts for `package.json`

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

VS Code - Auto fix on save (Optional)

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "eslint.rules.customizations": [
    { "rule": "@stylistic/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],
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
    "astro"
  ]
}
```

## Auto-detect

This config will look up your `package.json`, and auto enable related config rules

- Astro: `astro`
- React: `react`
- UnoCSS: `unocss`
- TailwindCSS: `tailwindcss`
- TypeScript: `typescript`

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

By the way, this config is based on `@antfu/eslint-config@3.5.0`, So you can reference it's [Customization section](https://github.com/antfu/eslint-config/tree/v3.5.0#Customization).

## License

[MIT](./LICENSE) License &copy; 2024-PRESENT [Xat](https://github.com/Xatloon)
