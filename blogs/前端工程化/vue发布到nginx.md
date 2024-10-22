---
title: Vue发布到Nginx
date: 2024-10-22
tags:
  - nginx
categories:
  - 前端工程化
---

### 一、vue2使用cli构建器

#### 1.1 配置vue2

* 在vue.config.js中更改以下配置

* ```js
  // '/users/'为你的访问二级目录名称
  module.exports = {
    publicPath: '/users/',
  }
  ```

* 在路由中更改以下配置（以传统非Hash路由为例）

* ```js
  // '/users/'为你的访问二级目录名称
  const router = new VueRouter({
      mode: 'history',
      base: '/users/',
      routes
  });
  ```

### 二、vue3使用vite构建器

#### 2.1 配置vue3

* 在vite.config.js中更改以下配置

* ```js
  // '/manage/'为你的访问二级目录名称
  export default {
      base: '/manage/',
  }
  ```

* 在路由中更改以下配置（以传统非Hash路由为例）

* ```js
  // '/manage/'为你的访问二级目录名称
  const router = createRouter({
      history: createWebHistory('/manage/'),
      routes,
  });
  ```

### 三、配置nginx

#### 3.1 配置代理

* 在nginx.conf的server的标签内添加以下信息

* ```shell
   # nginx代理
   # /api为你需要代理的地址
   # / paoxy_pass为服务器地址
   location /api {
   	# 将/api替换成空，$1表示(.*)
   	rewrite  ^/api/(.*)$ /$1 break;
   	# 代理转发，/api的请求转发到http://localhost:9999地址下
   	proxy_pass http://localhost:9999;  
   }
  ```

#### 3.2 配置vue访问路径

* 在nginx.conf的server标签下添加以下信息

* ```shell
  # nginx路由
  location /manage/ {
  	root   html;
  	index  index.html index.htm;
  	# 此处为刷新后防止变为404，其中/manage/index为刷新后寻找地址，按需配置
  	try_files $uri $uri/ /manage/index.html;
  }
  
  location /users {
  	alias   html/users/;
  	index  index.html index.htm;
  	try_files $uri $uri/ /users/index.html;
  }
  ```

* 重启nginx即可，通过：域名/manage；域名/users进行访问

### 四、一些问题

#### 4.1 nginx中root与alias的区别

* root为在访问地址后追加二级路由，通过追加后的地址访问

* ```shell
  # nginx路由配置
  location /manage/ {
  	root   html;
  	index  index.html index.htm;
  	# 此处为刷新后防止变为404，其中/manage/index为刷新后寻找地址，按需配置
  	try_files $uri $uri/ /manage/index.html;
  }
  # 通过访问的是html/manage下的index.html及文件
  
  # 如果变为
  location /manage/ {
  	root   html/manage;
  	index  index.html index.htm;
  	# 此处为刷新后防止变为404，其中/manage/index为刷新后寻找地址，按需配置
  	try_files $uri $uri/ /manage/index.html;
  }
  # 访问的便是html/manage/manage下的index.html及文件
  ```

* alias为直接通过路径访问文件，不追加

* ```shell
  # nginx路由配置
  location /users {
  	alias   html/users/;
  	index  index.html index.htm;
  	try_files $uri $uri/ /users/index.html;
  }
  # 通过访问的是html/users下的index.html及文件，
  # 注意，alias路径后面一定要加上放斜杠/
  
  # 如果变为
  location /users {
  	alias   html/;
  	index  index.html index.htm;
  	try_files $uri $uri/ /users/index.html;
  }
  # 访问的便直接是html下的index.html及文件
  ```

* 查看日志排查配置问题，可以查看nginx的`error.log`文件

* ```shell
  # linux 系统可以使用 tail 命令查看日志文件末尾内容
  
  tail -f /etc/log/nginx/error.log # -f:动态读取文件末尾内容并显示
  tail -20 /etc/log/nginx/error.log # 显示文件末尾 20 行的内容，不加参数默认显示 10 行
  ```
