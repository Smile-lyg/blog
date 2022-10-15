---
title: cURL的使用
date: 2022-10-15
tags:
  - cURL
categories:
  - Notes
  - 工具使用
---

> Command Line URL viewer

![curl.jpg](./imgs/curl.jpg)

<!-- more -->

## 简单使用方法

## 访问网站

> curl + 网址

```sh
curl www.baidu.com
```

- `-A` 参数指定客户端用户代理标头（`User-Agent`）。curl 默认用户代理字符串是 `curl/[version]`

```sh
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.50" www.baidu.com
```

- `-H` 参数添加或者修改标头

```sh
curl -H "User-Agent: php/1.0" www.baidu.com
```

- 保存网页可以使用 `-o` 参数，相当于使用 `wget` 命令

```sh
curl -o [文件名] www.baidu.com
```

- `-O` 参数，将服务器响应保存成文件，并将 URL 的最后部分当做文件名

```sh
curl -O example.com/foo/bar.html
```

> 保存成 `bar.html` 文件

## 显示响应头信息

- `-i` 参数可以显示 http response 的头信息，连同网页代码一起

```sh
curl -i www.baidu.com
```

- `-I` 参数，只显示 http response 头信息

```sh
curl -I www.baidu.com
```

## 显示通信过程

- `-v` 参数 key 显示一次 http 通信的整个过程，包括端口连接和 http request 头信息

```sh
curl -v www.baidu.com
```

- 如果觉得上面的信息还不够，则可以使用 `--trace` 查看更详细的通信过程

```sh
curl --trace output.txt www.baidu.com
# or
curl --trace-ascii output.txx www.baidu.com
```

- 运行后请打开 txt 文件查看

## HTTP 动词

- curl 默认的 HTTP 动词是 GET，使用 `-X` 参数指定

```sh
curl -X DELETE www.example.com
```

## 发送表单信息

### GET

- 直接拼接

```sh
curl example.com/form?uname=123&psw=456
```

- `-G` 参数用来构造 URL 查询字符串

```sh
curl -G -d 'q=lala' -d 'count=20' example.com/search
```

> 以上命令会发出一个 GET 请求，实际请求的 URL 为：`http://example.com/search?q=lala&count=20`，如果省略 `-G` 则会发出一个 POST 请求，如果数据需要 URL 编码，可以结合 `--data-urlencode` 参数

### POST

- 需要用 `-X` 参数指定方法为 POST，使用 `--data` (`-d`) 携带参数

```sh
curl -X POST --data "uname=abc&psw=123" example.com/form
```

> 使用 `-d` 参数后，HTTP 请求会自动加上标头 `Content-type: application/x-www-form-urlencoded`，并且会自动将请求转为 POST 方法，因此可以省略 `-X POST`。
> 以上命令可改写成 `curl -d "uanme=abc&psw=123" example.com/form`

- 发送 JSON 数据，结合 `-H` 设置请求头为：`Content-Type: application/json`

```sh
curl -H 'Content-Type: application/json' -d '{username:"abc", password: "123"}' expample.com/login
```

- `--data-urlencode` 参数将发送的数据进行 URL 编码，同 `-d`

```sh
curl --data-urlencode "comment=hello world" example.com/login
```

> 这里发送的数据里面有一个空格，所以需要进行 url 编码

## 上传文件

- `-F` 参数用来向服务器上传二进制文件

```sh
curl -F "file=@photo.png" example.com/profile
```

> 上面的命令会给 HTTP 请求加上标头：`Content-type: multipart/form-data`，然后将 `photo.png` 作为 `file` 字段上传

- `-F` 可以指定 MIME 类型，默认为 `application/octet-stream`

```sh
curl -F "file=@photo.png;type=image/png" expamle.com/profile
```
