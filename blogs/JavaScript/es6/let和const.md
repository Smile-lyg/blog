---
title: JS基础：let、const
date: 2021-06-10
tags:
 - JavaScript
categories:
 - es6
---
## 顶层对象
- 在浏览器环境中是指window，在node环境中是值global
- var 和 function 声明的全局变量**属于**顶层对象的属性
- let、const、class 声明的全局变量**不属于**顶层对象的属性
```js
var a = 1
console.log(window.a) // >>> 1
let b = 2
console.log(window.b) // >>> undefined
```
## globalThis 对象
- 全局环境中this会返回顶层对象，但是node和es6中，返回的是当前模块
- 函数里面的this，如果函数不是作为对象方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，在严格模式下，this会返回undefined

## let
- 使用let声明的变量只在当前块级作用域内有效，只要出现大括号{}，就产生作用域，使用let声明的变量就是局部变量。
```js
{ let a = 1}
console.log(a) // >>> error: a is not defined
```
- let 不存在变量提升
```js
console.log(a) // >>> error: Cannot access 'a' before initialization
let a = '123'
```
- let 不允许重复声明
```js
let a = 123
let a = 456
console.log(a) // >>> error: Identifier 'a' has already been declared
```
- 暂时性死区，在当前作用域里如果找到了使用let声明了的变量，就绑定在当前作用域，不向外查找。
```js
let a = '111'
{ console.log(a) } // >>> 111
// --------------------------------
let b = 1
{  console.log(b); let b = 3;  } // >>> error: Cannot access 'b' before initialization
```

## const
- 声明一个只读的常量。
    - 声明的是基本数据类型，值不能改变。
    - 声明的是引用数据类型，地址不能改变。
- let的特点const也有。
```js
const a = 1
a = 2   // >>> error: Assignment to constant variable.

// 对象是地址引用数据,常量保持的是地址不变，可以修改引用的值，但是不能修改他指向的地址
const obj = { user: 'jack' }
obj.user = 'tom'
obj.age = 18
console.log(obj) // >>> {user:'tom',age:18}
obj = ['1'] // >>> error: Assignment to constant variable.
```