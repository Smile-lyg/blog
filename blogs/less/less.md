---
title: Less学习
date: 2021-06-13
tags:
  - Less
  - CSS
categories:
  - CSS
---

:::tip
Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。
<br>
CSS 预处理语言写的 css，浏览器不认识，需要编译成 css 文件。
:::
[中文文档](https://less.bootcss.com/)

## less 编译

1. 命令行用法

```shell
全局安装：npm i less -g
项目依赖：npm i less -S
编译命令：
lessc xxx.less
lessc xxx.less xxx.css
```

## 变量

- 定义：@变量名: 值
- 支持运算

```less
@baseWidth: 100px;
.main {
  width: @baseWidth*2;
}
// 编译后的css
.main {
  width: 200px;
}
```

## 嵌套

- Less 提供了使用嵌套（nesting）代替层叠或与层叠结合使用的能力。
  假设我们有以下 CSS 代码：

```css
.main .box {
  width: 100px;
}
```

- less 文件
- 用 Less 书写的代码更加简洁，并且模仿了 HTML 的组织结构。

```less
.main {
  .box {
    width: 100px;
  }
}
```

- **&** 表示当前选择器的父级

```less
.main {
  &:hover {
    color: green;
  }
}
.main:hover {
  color: green;
}
```

## 混合

- 混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。

```less
// 参数可以有默认值
.radius(@r: 8px) {
  border-radius: @r;
}
// 直接调用即可添加属性
.box {
  .radius(12px);
}
// 编译后的 css
.box {
  border-radius: 12px;
}
```

## 继承

- extend 是 Less 的一个伪类，可以继承所匹配声明中的所有样式。实现 css 复用。

```less
#main {
  width: 100px;
  height: 100px;
  .txt {
    color: #ccc;
  }
}
.box {
  &:extend(#main); // 继承#main里面的样式
  &:extend(#main .txt); // 继承.txt里面的样式
  // &:extend(#main all); // 继承整个#main的样式，包括子级。
}
// 编译后的css
#main,
.box {
  width: 100px;
  height: 100px;
}
#main .txt,
.box {
  color: #ccc;
}
```

## 导入

- 导入的工作方式和你预期的一样。你可以导入一个 .less 文件，此文件中的所有变量就可以全部使用了。如果导入的文件是 .less 扩展名，则可以将扩展名省略掉：

```less
@import 'color'; // color.less
@import 'default.css';
```

## 内置函数

[less 函数手册](https://less.bootcss.com/functions/)

## 实现 for 循环方法

- Less 并没有提供 for 循环方法，可以使用递归实现。

```less
// 循环方法
.demo(@n, @i: 1) when(@i <= @n) {
  // do sth
  .box-@{i} {
    width: (@i * 100% / @n);
  }
  // 递归
  .demo(@n, (@i + 1));
}
// 调用
.demo(4);

// 生成的css
.box-1 {
  width: 25%;
}
.box-2 {
  width: 50%;
}
.box-3 {
  width: 75%;
}
.box-4 {
  width: 100%;
}
```
