---
title: uni-app请求封装
date: 2022-02-11
tags:
  - uni-app
  - request封装
categories:
  - uni-app
---

## uni-app 请求处理

uni.request() 如果不传入 success 、fail、complete 参数，则会返回封装后的 **Promise** 对象，**.then** 返回一个数组，第一项是错误信息，第二项是结果

## 请求拦截器

在请求开始前进行一些处理

```js
let baseUrl =
  'https://www.fastmock.site/mock/12a3b588e4cb21b5706eed87c8d3e181/api'
// 请求拦截器
let beforeRequest = function(options = {}) {
  return new Promise((resolve, reject) => {
    options.url = baseUrl + options.url
    options.header = { token: 'abc...' }
    options.method = options.method || 'GET'

    resolve(options)
  })
}
// 使用
beforeRequest({ url: '/getRoomType' })
  .then((opt) => uni.request(opt))
  .then(([err, res]) => console.log(res))
```

抽离代码到单独的 **request.js** 文件中

```js
export default {
  config: {
    baseUrl:
      'https://www.fastmock.site/mock/12a3b588e4cb21b5706eed87c8d3e181/api',
    header: { token: 'abc...' },
    beforeRequest(options = {}) {
      options.url = this.baseUrl + options.url
      options.method = options.method || 'GET'
      options.header = this.header

      resolve(options)
    },
  },
  request(options = {}) {
    return this.config.beforeRequest(options).then((opt) => uni.request(opt))
  },
}
```

## 响应拦截器

在请求结束后做些什么

```js
export default {
  config: {
    ...
    // 响应拦截器
    handleResponse([err, res]) {
    	// 请求失败或者错误
    	if(res.statusCode != 200 || res.data.code != 200) {
  			let msg = res.data.desc || "请求失败"
  			uni.showToast({
  				title: msg,
  				icon: "none"
				})
        return reject(msg)
			}
      // 返回结果
      return resolve(res.data)
  	}
  },
  request(options = {}) {
    return this.config.beforeRequest(options)
    				.then(opt => uni.request(opt))
    				.then(this.config.handleResponse)
  }
}
```

在文件中使用

```js
import api from '@/api/request.js'

api.request({ url: 'getRoomType' }).then((res) => console.log(res))
```

## request.js

```js
export default {
  config: {
    // 请求根路径
    baseUrl:
      'https://www.fastmock.site/mock/12a3b588e4cb21b5706eed87c8d3e181/api',
    // 请求头
    header: { token: 'abc' },
    // 请求拦截器
    beforeRequest(options = {}) {
      return new Promise((resolve, reject) => {
        options.url = this.baseUrl + options.url
        options.method = options.method || 'GET'
        options.header = this.header

        resolve(options)
      })
    },
    // 响应拦截器
    handleResponse([err, res]) {
      return new Promise((resolve, reject) => {
        // 请求失败或者错误
        if (res.statusCode != 200 || res.data.code != 200) {
          let msg = res.data.desc || '请求失败'
          uni.showToast({
            title: msg,
            icon: 'none',
          })
          return reject(msg)
        }
        // 返回结果
        return resolve(res.data)
      })
    },
  },
  request(options = {}) {
    return this.config
      .beforeRequest(options)
      .then((opt) => uni.request(opt))
      .then(this.config.handleResponse)
  },
  // GET请求
  get(url, params = {}, options = {}) {
    options.url = url
    options.method = 'GET'
    options.data = params
    return this.request(options)
  },
  // POST请求
  post(url, params = {}, options = {}) {
    options.url = url
    options.method = 'POST'
    options.data = params
    return this.request(options)
  },
}
```

## api.js

对 API 进行统一管理

```js
import http from "@/api/request.js"

export default {
  // 获取房间类型
  getRoomType() {
    return http.get("/getRoomType")
  }
  ...
}
```

将 API 挂载到 Vue 对象上，**main.js** 中添加

```js
...
import api from "@/api/api.js"
Vue.prototype.$api = api
...
```

文件中使用

```js
this.$api.getRoomType().then((res) => console.log(res))
```
