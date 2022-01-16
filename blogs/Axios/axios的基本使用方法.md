---
title: Axios的基本使用方法
date: 2021-04-09
tags:
  - Axios
categories:
  - 笔记
---

## 安装

```shell
# npm
npm install axios
# yarn
yarn add axios
# cdn
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## 直接使用

1. 使用**.**执行某个请求方法，[method name]包含了 request、head、get、put、delete、post、patch。

`axios[method name](url[, data[, config]])`

## Example

- 执行**GET**请求

```js
import axios from axios;

// 为给定 ID 的 user 创建请求
axios.get('/user?ID=12345')
  .then(response => response)
  .catch(error => error);

// 可选地，上面的请求可以这样做
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(response => response)
  .catch(error => error);
```

- 执行**POST**请求

```js
axios
  .post('/login', {
    username: 'admin',
    password: '123456',
  })
  .then((response) => response)
  .catch((error) => error)
```

2. 使用传入**config**对象的方式调用

```js
axios([config])
  .then((response) => response)
  .catch((error) => error)

// 发送 POST 请求
axios({
  method: 'post',
  url: '/login',
  data: {
    username: 'admin',
    password: '123456',
  },
})
```

## 默认 config 配置

1. 配置请求超时时间

```js
# 使用defaults
axios.defaults.timeout = 30000 // 时间以毫秒为单位

# 使用实例传入config
var instance = axios.create({
    timeout: 30000
});

```

2. 配置请求携带**cookie**

```js
# 使用defaults
axios.defaults.withCredentials = true // true为自动携带

# 使用实例传入config
var instance = axios.create({
    withCredentials: true
});

```

3. 配置**baseURL**

- baseURL 将自动加在 url 前面，除非 url 是一个绝对 URL。

```js
# 使用defaults
axios.defaults.baseURL = 'https://github.com/Smile-lyg'

# 使用实例传入config
var instance = axios.create({
    baseURL: 'https://github.com/Smile-lyg'
});

```

4. 配置**headers**

- 例如设置**token**

```js
# 使用defaults
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

# 使用实例传入config
var instance = axios.create({
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': AUTH_TOKEN
});

```

- 更多详细配置项请 Axios 文档，[中文文档](https://www.kancloud.cn/yunye/axios/234845)

## 拦截器配置

1. 请求拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token
    token && (config.headers.Authorization = token)

    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
```

:::tip
这里说一下 token，一般是在登录完成之后，将用户的 token 通过 localStorage 或者 cookie 存在本地，然后用户每次在进入页面的时候（即在 main.js 中），会首先从本地存储中读取 token，如果 token 存在说明用户已经登陆过，则更新 vuex 中的 token 状态。然后，在每次请求接口的时候，都会在请求的 header 中携带 token，后台人员就可以根据你携带的 token 来判断你的登录是否过期，如果没有携带，则说明没有登录过。这时候或许有些小伙伴会有疑问了，就是每个请求都携带 token，那么要是一个页面不需要用户登录就可以访问的怎么办呢？其实，你前端的请求可以携带 token，但是后台可以选择不接收啊！
:::

2. 响应拦截器

```js
// 添加响应拦截器
// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                     Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
});
```

**要注意的是，上面的 Toast()方法，是我引入的 vant 库中的 toast 轻提示组件，你根据你的 ui 库，对应使用你的一个提示组件**

## http.js 中 axios 封装的优化

- 直接贴代码：

```js
/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '../router'
import store from '../store/index'
import { Toast } from 'vant'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg) => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true,
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath,
    },
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录')
      localStorage.removeItem('token')
      store.commit('loginSuccess', null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    default:
      console.log(other)
  }
}

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(
  (config) => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  (error) => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  (res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  // 请求失败
  (error) => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default instance
```
