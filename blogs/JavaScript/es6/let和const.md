---
title: 块级作用域绑定、let、const
date: 2022-06-10
tags:
  - JavaScript
categories:
  - es6
---

## 顶层对象

- 在浏览器环境中是指 window，在 node 环境中是值 global

## globalThis 对象

- 全局环境中 this 会返回顶层对象，但是 node 和 es6 中，返回的是当前模块
- 函数里面的 this，如果函数不是作为对象方法运行，而是单纯作为函数运行，this 会指向顶层对象。但是，在严格模式下，this 会返回 undefined

## var 声明及变量提升（Hoisting）机制

- 在函数作用域或全局作用域中通过关键字 var 声明的变量，无论实际上是在哪里声明的，都会被当成在当前作用域顶部声明的变量，这就是我们常说的提升（hoisting）机制。
  为此，ECMAScript 6 引入块级作用域来强化对变量生命周期的控制。

## 块级作用域

块级作用域（词法作用域）存在于：

- 函数内部
- 块中（字符 { 和 } 之间的区域）

## 循环中的块作用域绑定

在循环中 var 声明的变量得到提升，导致在循环外仍能访问该变量，使用 let 声明就不会有这种情况，变量会被局限于循环中，循环结束后立即销毁
:::tip
循环中的 let 声明，每次迭代循环都会创建一个新变量，并以之前迭代中同名变量的值将其初始化（初始化为当前 i 的值）。

- let 声明在循环内部的行为是标准中专门定义的，他不一定与 let 的不提升特性有关。
  :::

## 全局块作用域绑定

当 var 被用于全局作用域时，他会创建一个新的全局变量作为全局对象（浏览器：window 对象）的**属性**，这意味着用 var 很可能会无意中覆盖一个已经存在的全局属性。

```js
var a = 1
console.log(window.a) // >>> 1
```

:::tip

- var 和 function 声明的全局变量**属于**顶层对象的属性
- let、const、class 声明的全局变量**不属于**顶层对象的属性
  :::
  如果你在全局中使用 let、const，会在全局作用域下创建一个新的绑定，但该绑定不会添加为全局对象的属性。换句话说，用 let、const 不能覆盖全局变量，而只能遮蔽它。

```js
let b = 2
console.log(window.b) // >>> undefined

let RegExp = 'hello'
console.log(RegExp) // >>> hello
console.log(window.RegExp === RegExp) // >>> false
```

## 块级绑定的最佳实践

默认使用 **const** ，只在确实需要改变变量的值的时候使用 let 。这样就可以在某种程度上实现代码的不可变性，从而防止某些错误的产生。

## let

- 使用 let 声明的变量只在当前块级作用域内有效，只要出现大括号{}，就产生作用域，使用 let 声明的变量就是局部变量。

```js
{
  let a = 1
}
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

## 临时死区（Temporal Dead Zone）

:::tip
JavaScript 引擎在扫描代码的时候发现变量声明，遇到 var 声明，就就提升至作用域顶部，遇到 let、const 声明就将声明放入 TDZ 中。访问 TDZ 中的变量会触发运行时错误，只有执行过变量声明语句后，变量才会从 TDZ 中移出，方能正常访问。
:::

- 在当前作用域里如果找到了使用 let 声明了的变量，就绑定在当前作用域，不向外查找。

```js
let a = '111'
{
  console.log(a)
} // >>> 111
// --------------------------------
let b = 1
{
  console.log(b)
  let b = 3
} // >>> error: Cannot access 'b' before initialization
```

## const

- 声明一个只读的常量。
  - 声明的是基本数据类型，值不能改变。
  - 声明的是引用数据类型，地址不能改变。
- let 的特点 const 也有。
  :::tip
  - 每个通过 const 声明的常量必须进行初始化，否则会抛出语法错误
  - const 声明的常量不允许修改绑定，但允许修改绑定的值
    :::

```js
const a = 1
a = 2 // >>> error: Assignment to constant variable.

// 对象是地址引用数据,常量保持的是地址不变，可以修改引用的值，但是不能修改他指向的地址
const obj = { user: 'jack' }
obj.user = 'tom'
obj.age = 18
console.log(obj) // >>> {user:'tom',age:18}
obj = ['1'] // >>> error: Assignment to constant variable.
```
