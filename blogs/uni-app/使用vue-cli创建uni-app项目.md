---
title: 使用vue-cli创建uni-app项目
date: 2022-03-25
tags:
  - uni-app
  - vue-cli
categories:
  - uni-app
---

## 使用 vue-cli 创建 uni-app 项目

首先贴上 官方的教程啊 [uni-app 官网 通过 vue-cli 命令行创建 uni-app 项目](https://uniapp.dcloud.io/quickstart.html#_2-通过vue-cli命令行)

> 刚开始使用 node **16.13.2** 对应的 npm 版本是 **8.1.2**
> 创建的 项目跑起来 报错：Error: Cannot find module 'webpack/lib/RuleSet'....
> 网上搜了下：【这个问题是因为高版本的 node 默认装了 7 以上的 npm 版本。这个版本会要求强制解决 peer-dependency 的冲突 导致安装的 wepback 不对。】
> 解决方案也很多啊，但是刚好电脑上也装了 node 版本管理工具 nvm ，索性直接切换版本，使用低版本的 npm 来装

### 环境：

- node：14.15.0
- npm：6.14.8
- yarn：1.22.18
- @vue/cli：4.5.15

## 步骤

1. 全局安装 vue 脚手架

   ```shell
   npm install -g @vue/cli
   ```

2. yarn 也全局装一下，默认创建的 uni-app 项目是用 yarn 安装依赖，没安装会有问题

   ```shell
   npm install -g yarn
   ```

3. 开始创建 uni-app 项目

   ```shell
   vue create -p dcloudio/uni-preset-vue learn-uniapp(项目名称)
   ```

   可能因为网络原因会失败，多试几次

4. 命令行会进入选择项目模板，这里选择 **默认模板**，就是空项目，速度会快一些

5. 会自动使用 yarn 安装依赖，进度跑完后进入项目目录，运行

   ```shell
   cd learn-uniapp
   yarn serve
   ```

如果一切顺利的话，可以看到项目就跑起来了，默认运行在 http://localhost:8080/

运行项目的 npm 命令也可以是

```shell
npm run dev:h5
```

新创建的项目，根目录有一个 **.tsconfig.json** 文件，会导致 **.vue** 文件里面的，`<script></script>`标签内画波浪线，很不好看。

加上 allowJs=true 即可解决

```json
{
  "compilerOptions": {
    "allowJs": true,
    ...
  }
}

```

## 引入 uview

> uview 是一个 uni-app 的 UI 框架
> 由于 uview 依赖 scss ，引入时还有些坎坷
> 按照官网的教程，首先是 node-sass 安装不上，这个 node-sass 非常难装啊，npm 包介绍里也说了现在已经被弃用了，推荐使用 dart-sass。
> 我的报错是：command fail ...
> 网上搜索了下，解决方案还挺多的，我使用方法四解决了，即使用 dart-sass 替换 node-sass。参考 [node-sass 安装失败解决方案，不一样的解决思路！ - 掘金 (juejin.cn)](https://juejin.cn/post/7045881610129899557)

### 安装

1. 安装 **uview**

   ```shell
   yarn add uview-ui
   ```

2. 安装 **node-sass**

   ```shell
   yarn add -D node-sass:@yarn:dart-sass
   ```

   这里其实是使用 dart-sass 替换 node-sass，安装完成后的 node_modules 下的 node-sass 文件夹里面其实是 dart-sass 的东西

3. 安装 **sass-loader** 注意需要版本 10，否则可能会导致 vue 与 sass 的兼容问题而报错

   ```shell
   npm i sass-loader@10 -D
   ```

   大版本锁在 10 就行了，应该吧，这里省力直接是复制官网给的命令

### 配置 uview

1.  引入 uView 主 JS 库

```js
// main.js
import uView from 'uview-ui'
Vue.use(uView)
```

在项目`src`目录中的`main.js`中，引入并使用 uView 的 JS 库，注意这两行要放在`import Vue`之后。

2. 在引入 uView 的全局 SCSS 主题文件

   ```scss
   /* uni.scss */
   @import 'uview-ui/theme.scss';
   ```

   在项目`src`目录的`uni.scss`中引入此文件。

3. 引入 uView 基础样式

   ```vue
   <style lang="scss">
     @import 'uview-ui/index.scss';
   </style>
   ```

   注意要写在**第一行**，同时给 style 标签加入**lang="scss"**属性

4. 配置 easycom 组件模式

   ```json
   // pages.json
   {
     "easycom": {
       "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
     },

     // 此为本身已有的内容
     "pages": [
       // ......
     ]
   }
   ```

   请确保您的`pages.json`中只有一个`easycom`字段，否则请自行合并多个引入规则。

5. Cli 模式额外配置

   ```js
   // vue.config.js，如没有此文件则手动创建
   module.exports = {
     transpileDependencies: ['uview-ui'],
   }
   ```

到此，uview 算是配置好了，去页面里放一个组件试试吧。

## 使用 vscode 开发 uni-app 项目

同样的，先贴上官方的教程：[当 uni-app 遇见 vscode - DCloud 问答](https://ask.dcloud.net.cn/article/36286)

> vscode 当做一个代码编辑器体验还是很好的，
>
> 但是默认 uni-app 推荐的 HBuildX 也是专门针对开发 uni-app 的，很多在 hbx 里面还是更方便，比如说打包，运行到真机或模拟器都只能在 hbx 里面。

1. 安装组件语法提示

   ```shell
   yarn add -D @dcloudio/uni-helper-json
   ```

2. 添加代码块

   从[zhetengbiji/uniapp-snippets-vscode: uni-app 代码块（vscode） ](https://github.com/zhetengbiji/uniapp-snippets-vscode)下载代码块，将代码块文件放入项目下的 **.vscode** 目录，即可拥有和 HBuilderX 一样的代码块。

3. 项目配置文件 manifest.json 是带注释的，需更改打开方式，通过 **JSONC** 格式打开，否则都是报错很不好看。

4. 运行项目 `npm run dev:h5`
