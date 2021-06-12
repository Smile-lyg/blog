---
title: JS基础：模块化
date: 2021-06-12
tags:
  - JavaScript
categories:
  - es6
---

:::tip
es6 模块功能主要由两个命令构成：export 和 import。export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。
:::

## export 命令

```js
var num = 10
let count = 0
const myname = 'jack'
export { num, count, myname }
export function dmeo(param) {}
export class Person {
  constructor(name) {
    this.name = name
  }
}
```

- 通常情况下，export 输出的变量就是本来的名字，但是可以使用 **as** 关键字**重命名**

```js
function f() {}
export { f as fn }
```

## import 命令

- import 命令要使用 **as** 关键字，将输入的变量**重命名**。

```js
import { num, count, demo } from './test.js'
```

- import 命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口

```js
import { a } from './xxx.js'

a = {} // Syntax Error : 'a' is read-only;
```

- 上面代码中，脚本加载了变量 a，对其重新赋值就会报错，因为 a 是一个只读的接口。
- 如果 a 是一个对象，改写 a 的属性是允许的。

```js
import { a } from './xxx.js'

a.foo = 'hello' // 合法操作
```

- 上面代码中，a 的属性可以成功改写，并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性。

## 模块的整体加载

- 除了指定加载某个输出值，还可以使用整体加载，即用星号（\*）指定一个对象，所有输出值都加载在这个对象上面。

```js
import * as obj from './xxx'
```

## export default 命令

- export default 本质上就是输出一个叫做 default 的变量或方法，然后系统允许你为它取任意名字。
- 一个 js 文件中只能出现一次。

```js
// export-default.js
export default function() {
  console.log('foo')
}

// 或者写成
function foo() {
  console.log('foo')
}
export default foo
// 上面代码中，foo函数的函数名foo，在模块外部是无效的。加载的时候，视同匿名函数加载。

// import-default.js
// 需要注意的是，这时import命令后面，不使用大括号。可以使用任意名称。
import customName from './export-default'
customName() // 'foo'
```
