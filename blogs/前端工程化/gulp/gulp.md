---
title: gulp的基本使用方法
date: 2021-06-13
tags:
  - gulp
categories:
  - 前端工程化
---

:::tip
gulp 是一个基于流（stream）的自动化构建工具。<br>
可以对 js、css、HTML、图片等资源进行压缩/打包，减小体积，等等。
:::
[文档](https://www.gulpjs.com.cn/docs/getting-started/quick-start/)

## 快速体验

- 安装
  - 安装命令行工具：`npm i gulp-cli -g`
  - 安装项目依赖：`npm i gulp -D`
- 根目录下创建 gulpfile.js 配置文件，输入以下代码

```js
function defaultTask(cb) {
  // place code for your default task here
  cb()
}

exports.default = defaultTask
```

- 测试：命令行输入: gulp

## 创建任务

- 任务（task），就是一个函数，使用 export 导出
- Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。series() 和 parallel() 可以互相嵌套至任意深度。
- series()：**按顺序执行**。
- parallel()：**并发执行**。

```js
const { series, parallel } = require('gulp')

function transpile(cb) {
  // body omitted
  cb()
}

function bundle(cb) {
  // body omitted
  cb()
}

exports.build = series(transpile, bundle) // 顺序执行
exports.build = parallel(transpile, bundle) // 同时执行
```

## 异步执行

- 当从任务（task）中返回 stream、promise、event emitter、child process 或 observable 时，成功或错误值将通知 gulp 是否继续执行或结束。如果任务（task）出错，gulp 将立即结束执行并显示该错误。

```js
// 返回 stream
const { src, dest } = require('gulp')

function streamTask() {
  return src('*.js').pipe(dest('output'))
}

exports.default = streamTask
```

## 处理文件

- gulp 暴露了 src() 和 dest() 方法用于处理计算机上存放的文件。
  - **src()**：接受 **glob** 参数，并从文件系统中读取文件然后生成一个 Node 流（stream）。它将所有**匹配的文件**读取到内存中并通过流（stream）进行处理。
  - **dest()**：接受一个输出目录作为参数，并且它还会产生一个 Node 流（stream），通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。
- 流（stream）所提供的主要的 API 是 **.pipe()**方法，用于连接转换流（Transform streams）或可写流（Writable streams）
  - **pipe()**：对流信息进行处理，需要使用对应的插件。

```js
const { src, dest } = require('gulp')
const babel = require('gulp-babel')

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'))
}
```

- glob 是由普通字符和/或通配字符组成的字符串，用于匹配文件路径。可以利用一个或多个 glob 在文件系统中定位文件。
  - 特殊字符： \* (一个星号)，在一个字符串片段中匹配任意数量的字符，包括零个匹配。对于匹配单级目录下的文件很有用。
    - src('js/\*.js')，匹配 js 目录下所有.js 文件。
  - 特殊字符： \*\* (两个星号)，在多个字符串片段中匹配任意数量的字符，包括零个匹配。 对于匹配嵌套目录下的文件很有用。
    - src('scripts/\*\*/\*.js')，匹配 scripts 目录下的所有 js 文件，无论有多少级子目录。
  - 特殊字符： ! (取反)
    - src(['scripts/\*\*/\*.js','!script/vendor/'])，匹配 scripts 目录下的所有 js 文件，排除 script 下的 vendor 文件夹

## 使用插件

- Gulp 插件实质上是 Node 转换流（Transform Streams），它封装了通过管道（pipeline）转换文件的常见功能，通常是使用 .pipe() 方法并放在 src() 和 dest() 之间。他们可以更改经过流（stream）的每个文件的文件名、元数据或文件内容。
- 托管在 npm 上的插件 - 标记有 "gulpplugin" 和 "gulpfriendly" 关键词 - 可以在 [插件搜索页面](https://gulpjs.com/plugins/) 上浏览和搜索。

1. gulp-uglify：用于压缩 JavaScript 代码。

```js
const { src, dest } = require('gulp')
const uglify = require('gulp-uglify')

function minifyJS() {
  return src('js/jquery.js')
    .pipe(uglify())
    .pipe(dest('dist/js'))
}
exports.ysJS = minifyJS
// 命令行执行gulp ysJS
```

2. gulp-clean-css：压缩 css 代码。

```js
const { src, dest } = require('gulp')
const cleanCSS = require('gulp-clean-css')

function minifyCSS() {
  return src('css/bootstrap.css')
    .pipe(cleanCSS())
    .pipe(dest('dist/css'))
}
exports.ysCSS = minifyCSS
```

3. gulp-htmlmin：压缩 HTML 代码。

```js
const { src, dest } = require('gulp')
const htmlmin = require('gulp-htmlmin')

function minifyHTML() {
  return src('html/index.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('dist'))
}
exports.yshtml = minifyHTML
```

4. gulp-rename：重命名文件插件。

```js
//...
const rename = require('gulp-rename')
  //...
  .pipe(
    rename({
      // dirname: "static/css",
      // basename: "bootstrap",
      // prefix: "my-", // 文件名前缀
      suffix: '.min', // 文件名后缀
      // extname: ".css" // 扩展名
    })
  )
//...
```

4. gulp-babel：JavaScript 高级语法转换。

- npm i -D gulp-babel @babel/core @babel/preset-env

```js
const { src, dest } = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

function babelJS() {
  return src('js/es6.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(rename({ basename: 'es5' }))
    .pipe(dest('dist/js'))
    .pipe(uglify()) // 压缩js
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/js'))
}
exports.bjs = babelJS
```

5. gulp-imagemin：压缩 PNG, JPEG, GIF and SVG 图片。（不好用，总容易出错）
   - 若出错请使用 cnpm 安装

```js
const imagemin = require('gulp-imagemin');
// 不提供参数，默认的配置满足大多数情况下的需要。
.pipe(imagemin())

// 配置插件会完全覆盖原有的插件，请完整传递这些默认的插件：[imagemin.gifsicle(), imagemin.mozjpeg(), imagemin.optipng(), imagemin.svgo()]
// 通用配置
.pipe(
  imagemin([
    imagemin.gifsicle({ interlaced: true }),  // 是否隔行扫描gif进行渲染， 默认false，
    imagemin.mozjpeg({ quality: 75, progressive: true }), // progressive，是否无损压缩jpg图片  默认false，
    imagemin.optipng({ optimizationLevel: 5 }), // 优化等级（0-7），默认 3
    imagemin.svgo({
      plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
    }),
  ])
)

```

6. gulp-concat：合并文件。

```js
const concat = require('gulp-concat')

 function task() {
  return .src('./lib/*.js')
    .pipe(concat('all.js'))
    .pipe(dest('./dist/js'))
})
exports.default = task
```

## watch()

- 监听 globs 并在发生更改时运行任务。
- watch(globs, [options], [task])

```js
const { src, dest, watch } = require('gulp')
const babel = require('gulp-babel')

function test() {
  return src('js/es6.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(dest('dist/js'))
}
exports.t = test
watch(['js/es6.js'], { ignoreInitial: false }, test) // 运行gulp t的时候执行t任务，同时也会执行test任务
```

- options 属性
  1. ignoreInitial，布尔值，默认为 true。即实例化 watch 的时候，默认不执行里面的任务。
  2. events，数组，默认[ 'add','change','unlink' ]，即创建、修改、删除文件触发任务。可以是 'add'、'addDir'、'change'、'unlink'、'unlinkDir', 'ready'、和/或 'error'。 另外 'all' 也是可用的，它表示除 'ready' 和 'error' 之外的所有事件。
  3. delay，文件更改和任务执行之间的毫秒延迟。默认 200，即文件修改后延迟 200ms，再运行任务。
