---
title: 使用vite搭建vue2环境总结
date: 2022-09-11
tags:
  - vue
  - vite
categories:
  - vite
  - 前端工程化
---

## 导入vue单文件组件需要加上后缀名
- 在使用`@vue/cli`搭建的项目环境中，在Webpack配置中增加了对`.vue`文件扩展名的解析，所以导入可以省略。
- `vite`中虽然也可以配置忽略，但在`vite`文档中不建议忽略自定义导入类型的扩展名，因为它会影响 IDE 和类型支持，所以需要将以前所有没有写明`.vue`后缀的模块引入都给补上。

## 启用jsx语法
- 在vite中使用jsx还是稍微有点麻烦的，一是使用到jsx语法的js文件都必须改成使用**jsx后缀名**，二是在vue的sfc组件中还得加上jsx标识
1. 在 `vite-plugin-vue2` 插件中启用 `jsx`
- `vite.config.js`
```js{10}
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  return {
    plugins: [
      createVuePlugin({ jsx: true })
    ],
  }
})
```
2. 单文件组件加上 `jsx` 标识
```vue{1}
<script lang="jsx">
  export default {
    render(){
      return <div>JSX Render</div>
    }
  }
</script>
```
:::tip
当vite-plugin-vue2发现有导入的资源是vue类型并且有lang=jsx的标识的时候，就会启用jsx转译，其核心依然是通过babel使用@vue/babel-preset-jsx进行转译,这里有一个坑点需要注意：<br />
当使用babel转译的时候，babel会默认搜寻当前项目目录中的babel配置文件，例如babelrc或者babel.config.js,如果当前项目存在着有babel的配置文件，则会在编译jsx语法代码的时候被启用,那么则需要确认配置文件中是否已经包含过@vue/babel-preset-jsx,不能重复添加同一个preset，否则编译会产生错误
:::

## vue模板编译出现多余空格字符

```js{12-16}
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  return {
    plugins: [
      createVuePlugin({
        jsx: true,
        vueTemplateOptions: {
          compilerOptions: {
            whitespace: 'condense', // 去除模板里面的多余空格
          },
        },
     })
    ],
  }
})
```

## scss无法使用:export导出变量
- vite中使用scss只需要安装sass就行了，`npm i sass`
- vite不支持`:export`这种语法：
```scss
$primary: #1890ff
:export {
    primary: $primary
}
```
- 解决方案：启用css-modules功能即可，开启css-modules功能也很简单，直接将scss文件后缀名改为 module.scss即可
- 新建一个`xxx.module.scss`文件，在需要的地方导入这个即可，以对象形式访问scss变量。

## 使用 svg-icon
- 使用插件`vite-plugin-svg-icons`来支持svg-icon的引入
```sh
npm i vite-plugin-svg-icons -D
# 依赖fast-glob
npm i fast-glob -D
```
- 配置`vite.config.js`
```js{3,12-17}
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  return {
    plugins: [
      createVuePlugin({ jsx: true }),
      createSvgIconsPlugin({
        // 指定要缓存的图标文件夹
        iconDirs: [resolve('src/icons/svg')],
        // 执行icon name的格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  }
})
```
- 同时在`main.js`中引入
```js
import 'virtual:svg-icons-register';
```
## require.context导入需改为import.meta.glob
- require.context是webpack独有的语法，用于创建一个require上下文，通常用于批量导入模块。然而在vite中根本不支持require，所有的模块导入都必须使用import，所以vite中也提供了一个用于批量导入的glob导入功能：
- `import.meta.glob`，动态导入多个模块（懒加载）
```js
const modules = import.meta.glob('./dir/*.js')
// 以上语句会被转译为如下的样子：
// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```
- 可以遍历 modules 对象的 key 值来访问相应的模块：
```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```
- 静态导入多个模块，添加 `eager: true`
```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
// 以上语句会被转译为如下的样子：
// vite 生成的代码
// vite 生成的代码
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```
### 示例，批量导入vuex的module
```js{7-17,21}
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

function genModules() {
  const modulesList = import.meta.glob('./modules/*.js', { eager: true })
  const modules = {}
  for (const path in modulesList) {
    // set './modules/app.js' => 'app'
    const moduleName = path.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
    // use default to get instance
    modules[moduleName] = modulesList[path].default
  }
  return modules
}


const store = new Vuex.Store({
  modules: genModules(),
  getters
})

export default store
```

## 路径别名配置
```js{17-22}
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'

function resolve(dir) {
  return path.resolve(process.cwd(), '.', dir)
}

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  return {
    plugins: [
      createVuePlugin({ jsx: true })
    ],
    resolve: {
      alias: {
        '@': resolve('src') + '/',
      },
    },
  }
})
```
### vscode 配置使用路径别名时文件提示
- `jsconfig.json`
```json{3-6}
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "jsx": "preserve"
  },
  "exclude": ["node_modules", "dist"]
}
```
## [vite环境变量](https://cn.vitejs.dev/guide/env-and-mode.html#env-variables-and-modes)
- 根目录下的`.env`文件会被默认读取，包括`.env.production`、`.env.development`
- env文件里面的以 `VITE_`为前缀的变量会以**字符串形式**被暴露出去，通过`import.meta.env.VITE_SOME_KEY`来访问
```env
VITE_PUBLIC_PATH = /
VITE_DEV_PORT = 8800
# 请求根地址
VITE_BASEURL = http://127.0.0.1:8000
```
## 配置文件里面加载环境变量
- 通过`loadEnv`函数加载环境变量都是字符串形式的，可以通过自定义方法转换一些特殊变量类型，如 `Boolean`
- `vite.config.js`
```js{3-4,15,17,20,22,25,38,43}
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'
import path from 'path'

function resolve(dir) {
  return path.resolve(process.cwd(), '.', dir)
}

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  const root = process.cwd()

  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_PUBLIC_PATH, VITE_DEV_PORT, VITE_BASEURL } = viteEnv

  return {
    base: VITE_PUBLIC_PATH,
    root,
    plugins: [
      createVuePlugin({
        jsx: true,
        vueTemplateOptions: {
          compilerOptions: {
            whitespace: 'condense', // 去除模板里面的多余空格
          },
        },
      }),
    ],
    server: {
      port: VITE_DEV_PORT,
      host: true,
      open: true,
      proxy: {
        '/api': {
          target: VITE_BASEURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    },
  }
})

```
- `wrapperEnv`函数
```js
// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf) {
  const ret = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }

    ret[envName] = realName;
    if (typeof realName === 'string') {
      process.env[envName] = realName;
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
}
```

## 本地及开发环境数据 mock
- 使用插件 [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)， 用于本地及开发环境数据 mock
### 安装
```sh
npm i mockjs
npm i vite-plugin-mock -D
```
### 开发环境使用
- `vite.config.js`
```js{2,10-13}
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  return {
    plugins: [
      viteMockServe({
        mockPath: 'mock', // mock文件所在目录
        localEnabled: command === 'serve',
      })
    ],
  }
})
```
- 编写`mock/mockData.ts`
```ts
import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: (req, res) => {
      return {
        code: 200,
        msg: 'success',
        data: []
      }
    }
  }
] as MockMethod[]
```
### 生产环境使用
- 创建`mock/mockProdServer.ts`文件
```ts
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 导入你的mock模块
import mockData from './mockData'

export function setupProdMockServer() {
  createProdMockServer([...mockData])
}
```
- `vite.config.js`
```js{2,13-18}
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  // command === 'serve' | 'build'
  // mode === 'development' | 'production'

  return {
    plugins: [
      viteMockServe({
        mockPath: 'mock', // mock文件所在目录
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && VITE_PROD_MOCK, // VITE_PROD_MOCK 根据项目配置。可以配置在.env文件
        // 这样可以控制关闭mock的时候不让mock打包到最终代码内，注意引入的路径是基于main.js文件的位置，不是根目录
        injectCode: `
          import { setupProdMockServer } from '../mock/mockProdServer';
          setupProdMockServer();
        `
      })
    ],
  }
})
```