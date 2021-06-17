---
title: Webpack的基本使用方法
date: 2021-06-14
tags:
  - Webpack
categories:
  - 前端工程化
---

:::tip
本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle.js。<br>
webpack 还可以用作开发阶段服务器。
:::

- [中文文档](https://www.webpackjs.com/concepts/)
- 安装
  - npm i -D webpack
  - npm i -D webpack-cli
- 创建配置文件 webpack.config.js

```js
const path = require('path)

module.exports = {
  entry:'src/main.js',
  output:{
    path: path.join(__dirname, 'dist'),
    filename: 'build.js'
  }
}
```

## 入口(entry)

入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。默认值为 ./src。

- 单入口文件：entry: string | Array<string>，打包后生成一个 js 文件。
- 多入口文件：entry：Object，打包后生成多个 js 文件。

## 出口(output)

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。

```js
const path = require('path')

module.exports = {
  // 单入口
  // entry: './src/main.js',
  // entry: ['./src/main.js', './src/app.js'],
  // 多入口
  entry: {
    app: './src/app.js',
    main: './src/main.js',
  },
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 单入口的出口名
    // filename: 'build.js'
    // 多入口的输出名，除了 name 还可以使用 hash/chunkhash
    filename: '[name]_[hash:8].js', // 生成 8 位的hash
  },
}
```

## loader

loader 让 webpack 能够去处理那些**非 JavaScript 文件**（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

1. babel-loader：es6 -> es5

- npm i -D babel-loader @babel/core @babel/preset-env
- babel 配置，1.直接再 loader 里面配置；2.创建.babelrc 文件或 babel.config.js 文件

```js
// Loader
module: {
  rules: [
    {
      test: /\.js$/,
      // 排除
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
  ]
}
```

2. file-loader

- 默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。

- npm i -D file-loader

```js
{
  test: /\.(png|jpg|gif|svg)$/,
  use: 'file-loader'
}
```

- 生成文件 file.png，输出到输出目录并返回 public URL。

3. ...

## 插件(plugins)

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

1. clean-webpack-plugin

- 每次打包先清空打包目录（dist）
  npm i -D clean-webpack-plugin

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// ...
plugins: [new CleanWebpackPlugin()]
```

2. html-webpack-plugin

- 该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包。
  npm i -D html-webpack-plugin

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [new HtmlWebpackPlugin()]
//// 配置
plugins: [
  new HtmlWebpackPlugin({
    template: './public/index.html', // 按照模板文件生成
    filename: 'home.html',
    // ...
  }),
]
```

## 模式(mode)

通过选择 **development** 或 **production** 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

```js
module.exports = {
  mode: 'production' | 'development',
}
// 或者从 CLI 参数中传递：
webpack --mode=production
```

## devtool

此选项控制是否生成，以及如何生成 source map。

- 报错时控制报错信息的详细程度

```js
// 报错信息控制
devtool: 'eval' // 生成后的代码
devtool: 'cheap-eval-source-map' // 转换过的代码 （仅限行）
devtool: 'cheap-module-eval-source-map' // 原始源代码 （仅限行）
devtool: 'source-map' // 原始源代码，生产环境使用，生成map文件
```

### 品质说明

- 打包后的代码：将所有生成的代码视为**一大块代码**。你看不到相互分离的模块。
- 生成后的代码（eval）：每个模块相互分离，并用模块名称进行注释。可以看到用 webpack 编译转换后的代码（\_\_webpack\_\_ ...）。
- 转换过的代码：可以看到 webpack 转换前、loader 转译后的代码。
- 原始源代码：你会看到转译之前的代码，正如编写它时。
- ...

## 开发阶段服务器（webpack-dev-server）

webpack-dev-server 能够用于快速开发应用程序。实时打包显示最新效果。

- npm i -D webpack-dev-server

```js
// 配置
devServer: {
  contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。
  compress: true, // 一切服务都启用gzip 压缩：
  host:'localhost', // 指定使用一个 host。默认是 localhost。
  port: 9000, // 端口号
  open: true, // 自动打开浏览器
  openPage: 'home.html', // 打开指定页面
  // 后端api代理
  proxy: {
    "/api": {
        target: "http://127.0.0.1:3000", // 代理目标地址
        changeOrigin: true, // 允许改变主域名

        // 若不重写路径：请求到 /api/users 现在会被代理到请求 http://127.0.0.1:3000/api/users。
        pathRewrite: {"/api" : ""} // 路径重写，即设置 '/api' 为空，请求到 /api/users 现在会被代理到请求 http://127.0.0.1:3000/users。
      }
  },
  // 拦截网络请求，app 是 express 实例对象
  before(app){
  app.get('/some/path', function(req, res) {
    res.json({ custom: 'response' });
  });
}
}
```

运行：**webpack serve**

- 注意：开发阶段服务器运行后会生成 dist 文件夹，但是是在内存中，不是真实的文件夹。
- 运行后开发服务器会处于监听状态，当前项目关联文件发生变化时会立即打包编译。
