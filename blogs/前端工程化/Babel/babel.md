---
title: Babel的基本使用方法
date: 2021-06-10
tags:
 - Babel
categories:
 - 前端工程化
---

## Babel 是一个 JavaScript compiler

:::tip
Babel 是一个工具链，主要用于在旧的浏览器或环境中将 ECMAScript 2015+ 代码转换为向后兼容版本的 JavaScript 代码。（@babel/preset-env）<br>
Babel 可以转换 JSX 语法！（@babel/preset-react）<br>
Babel 可以删除类型注释！（@babel/preset-flow）
:::

1. 安装
```shell
npm i -D @babel/core @babel/preset-env
or
yarn add @babel/core @babel/preset-env -D
```
- `@babel/preset-env`包含了最新的JavaScript转换规则集

2. 配置
在项目根目录新建一个**.babelrc**文件
```js
{
  "presets": [...],
  "plugins": [...]
}
```
或者**babel.config.js**文件
```js
// 项目要发布阶段需要用到的Babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('...')
}
module.exports = {
  "presets": [...],
  "plugins": [...prodPlugins]
}
```

3. 使用
- 命令行运行，安装@babel/cli
```shell
npm i -D @babel/cli
```

1. 编译单个js文件，转码结果输出到控制台
`npx babel xxx.js`
2. 使用`--out-file`或`-o`，将转码结果输出到新文件
`npx babe; xxx.js -o aaa.js`
3. 使用`--out-dir`或`-d`将整个目录里所有文件转码，输出到另一个目录
`npx babel src -d lib`
4. 使用`--watch`或`-w`，监视文件改动，实时编译。
`npx babel xxx.js -w -o aaa.js`
5. 使用`--ignore`，忽略不需要编译的文件
`npx babel src --out-dir lib --ignore "src/**/*.spec.js","src/**/*.test.js"`