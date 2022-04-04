---
title: es6：函数的扩展
date: 2022-04-04
tags:
  - JavaScript
categories:
  - es6
---

## 函数形参的默认值

## es5 中模拟默认参数

```js
function makeRequest(url, timeout, callback) {
  timeout = timeout || 5000
  callback = callback || function() {}
  // ...
}
```

这里，timeout 和 callback 为可选参数。对于函数的命名参数，如果不显示的传值，其默认值为 undefined，因此我们经常使用逻辑或操作符来为缺失的参数提供默认值。
::: warning
这个方法也有缺陷，当我们要给该函数第二个形参 timeout 传入值为 0，即使这个值是合法的，也会被视作一个假值，并最终将 timeout 赋值为 5000
:::
在这种情况下，更安全的选择是通过 typeof 检查参数类型，如下

```js
function makeRequest(url, timeout, callback) {
  timeout = typeof timeout !== 'undefined' ? timeout : 5000
  callback = typeof callback !== 'undefined' ? callback : function() {}
  // ...
}
```

尽管这种方法更安全，但是仍需额外的代码来执行这种非常基础的操作。

## es6 中的默认参数值

```js
function makeRequest(url, timeout = 5000, callback = function() {}) {
  // ...
}
```

在这个函数中，只有第一个参数值被认为总是要为其传入值的，其他两个参数都有默认值。
::: tip
当不为第二个参数传入值，或主动为第二个参数传入 **undefined** 时才会使用默认值。
对于默认参数值，**null** 是一个合法值，传入 null，会其值会为 null。
:::

## 默认参数表达式

非原始值传参，如可以通过函数执行来得到默认参数的值

```js
function getValue() {
  return 5
}
function add(first, second = getValue()) {
  return first + second
}
console.log(add(1, 2)) // 3
console.log(add(1)) // 6
```

初次解析函数声明时不会调用 getvalue 方法，只有当调用 add 函数且不传入第二个参数的时候才会调用。
::: warning
当使用函数调用结果作为默认参数值得时候，如果忘记写小括号，如 second=getValue，最终传入的是对函数的引用，而不是函数的调用结果。
:::
正是因为默认参数是在函数调用时求值，所以可以使用先定义的参数作为后定义的参数的默认值。

```js
function getValue(v) {
  return v + 5
}
function add(first, second = getValue(first)) {
  return first + second
}
console.log(add(1, 2)) // 3
console.log(add(1)) // 1 + 6 = 7
```

注意：在引用默认参数值的时候，只允许引用前面参数的值，即先定义的参数不能访问后定义的参数。
::: tip
函数参数有自己的作用域和临时死区 TDZ，其与函数体的作用域是各自独立的。也就是说参数的默认值不可访问函数体内声明的变量。
:::

## 不定参数

早先使用 arguments 对象来检查函数的所有参数，实际使用起来有些不方便。
在函数的命名参数前面添加三个点（...），就表名这是一个不定参数。
该参数为一个数组，包含着自他之后传入的所有参数，通过这个数组名即可逐一访问里面的参数。

```js
function demo(a, ...args) {
  console.log(a, args)
}
demo(1, 2, 3) // 1 [2,3]
```

### 不定参数的使用限制

1. 每个函数最多只能声明**一个**不定参数。
2. 不定参数一点要放在所有参数的**末尾**

### 不定参数对 arguments 对象的影响

如果声明函数时定义了不定参数，则在函数被调用时，arguments 对象包含了所有传入函数的参数。
其实，无论是否使用不定参数，arguments 对象总是包含了所有传入函数的参数。

### 展开运算符

与不定参数最相似的是...展开运算符。可以让你指定一个数组，将他们打散后作为独立的参数传入函数，如

```js
let values = [44, 12, 64, 71]
console.log(Math.max(...values)) // 等价于 Math.max(44, 12, 64, 71)
```

## name 属性

函数的 name 属性，返回该函数的函数名。

### name 属性的特殊情况

1. 函数表达式的名字比赋值变量的权重高
2. 通过 bind()创建的函数名称将带有 bound 前缀
3. 通过 Function 构造函数创建的函数，其名称为 anonymous

```js
let doSth = function doSomething() {}
let person = {
  get firstName() {
    return 'Nick'
  },
  sayName: function() {
    console.log(this.name)
  },
}
console.log(doSth.name) // doSomething
console.log(person.sayName.name) // sayName
console.log(person.firstName.name) // undefined

let fn = function() {}
console.log(fn.bind().name) // bound fn
console.log(new Function().name) // anonymous
```

::: tip
函数的 name 属性的值，不一定引用同名变量，它只是协助调试用的额外信息，所以不能使用 name 属性的值来获取对于函数的引用。
:::

## 块级函数

在代码块中声明一个函数，即为块级函数。

```js
'use strict'
if (true) {
  console.log(typeof doSth) // function
  function doSth() {}
}
console.log(typeof doSth) // undefined
```

在严格模式下，在定义函数的代码块内，块级函数会被提升至顶部，一旦 if 语句代码块执行结束，doSth 函数将不再存在
非严格模式下，块级函数不在提升至代码块的顶部，而是提升至外围函数或全局作用域的顶部。

```js
if (true) {
  console.log(typeof doSth) // function
  function doSth() {}
}
console.log(typeof doSth) // function
```

## 箭头函数

箭头函数是一种用箭头（=>）定义函数的新语法，他与传统 JavaScript 函数有些许不同，主要集中在以下方面

- 没有 this、super、arguments 和 new.target 绑定。这些由外围最近一层非箭头函数决定。
- 不能通过 new 关键字调用。箭头函数没有[[Construct]]方法，所以不能被用作构造函数。
- 没有原型，箭头函数不存在 prototype 这个属性。
- 不可以改变 this 绑定，不能通过 call、bind、apply 方法来改变 this 的值
- 不支持 arguments 对象
- 不支持重复的命名参数

## 箭头函数语法

只有一个参数时可以省略圆括号，没有参数时需要圆括号
没有显式的返回语句，即只有一条语句时默认返回，不需要写 return，可省略花括号{}

```js
let fn = () => console.log(1)
let reflect = value => value
let sum = (a, b) => a + b
```

花括号代表函数体部分，如果想返回一个对象字面量，需要将该对象包裹在小括号内

```js
let getObj = id => ({ id: id, name: '张三' })
```
