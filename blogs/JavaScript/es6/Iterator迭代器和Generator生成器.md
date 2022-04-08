---
title: es6：迭代器Iterator和生成器Generator
date: 2022-04-08
tags:
  - JavaScript
  - Iterator
  - Generator
categories:
  - es6
---

## 循环语句的问题

虽然 for 循环语句的语法简单，但是如果将多个循环嵌套则需要追踪多个变量，代码的复杂度会大大增加，一不小心就错误使用了其他 for 循环的跟踪变量，从而导致程序出错。**迭代器**的出现旨在消除这种复杂性并减少循环中的错误。

## 什么是迭代器

迭代器是一种特殊的对象，它具有一些专门为迭代过程设计的专有接口，所有迭代器对象都有一个 next() 方法，每次调用都返回一个结果对象。<br>
结果对象包含两个属性：value，表示当前成员的值，done，是布尔类型的值，表示是否结束，当没有更多数据时返回 true。<br>
迭代器还会保存一个指针，用来指向当前集合中值的位置，每调用一次 next() 方法，指针后移，指向下一个元素，直到结束位置。<br>
使用 ECMAScript 5 的语法创建一个迭代器：

```js
function createIterator(arr) {
  var i = 0
  return {
    next: function() {
      var done = i >= arr.length
      var value = !done ? arr[i++] : undefined

      return { value: value, done: done }
    },
  }
}

var iterator = createIterator([1, 2, 3])

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
// 之后调用都会返回相同的内容
console.log(iterator.next()) // { value: undefined, done: true }
```

## 什么是生成器

ECMAScript 6 同时还引入了一个生成器对象，他可以让创建迭代器对象的过程变得简单<br>
生成器是一种返回迭代器的函数，通过 function 关键字后的 （\*） 来表示，函数中会用到新的关键字 yield 。星号可以紧挨着 function 关键字，也可以在中间添加一个空格。

```js
function* createIterator() {
  yield 1
  yield 2
  yield 3
}

let itetator = createIterator()

console.log(itetator.next().value) // 1
console.log(itetator.next().value) // 2
console.log(itetator.next().value) // 3
console.log(itetator.next().value) // undefined
```

yield 关键字用来指定调用迭代器的 next() 方法时的返回值及返回顺序。
:::tip
生成器函数最有趣的部分大概是，每当执行完一条 yield 语句后，函数都会自动停止执行。直到再次调用 next()方法才会继续执行。使用 yield 关键字可以返回任何值或表达式
:::

### yield 的使用限制

yield 关键字只可在生成器内部使用，在其他地方使用会导致程序错误，即便是在生成器内部的函数里面使用也是如此。

```js {4}
function* createIterator(arr){
  arr.forEach(function(item){
    // 语法错误，程序无法运行
    yield item
  });
}
```

## 创建生成器

```js {2,8,15}
// 1函数定义，关键字后跟*号
function* createIterator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i]
  }
}
// 2生成器函数表达式
let createIterator = function*(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i]
  }
}
// 3生成器对象方法
let obj = {
  createIterator: function*(arr) {
    for (let i = 0; i < arr.length; i++) {
      yield arr[i]
    }
  },
}
// let itetator = createIterator([1, 2, 3])
let itetator = obj.createIterator([1, 2, 3])

console.log(itetator.next().value) // 1
console.log(itetator.next().value) // 2
console.log(itetator.next().value) // 3
console.log(itetator.next().value) // undefined
```

:::warning
不能使用箭头函数来创建生成器
:::

## 可迭代对象和 for-of 循环

### 可迭代对象

可迭代对象具有 Symbol.iterator 属性，是一种与迭代器密切相关的对象。
在 ECMAScript 6 中，所有的集合对象（数组、Set、Map）和字符串都是可迭代对象，这些对象都有默认的迭代器。

### for-of 循环

for-of 循环每次执行都会调用可迭代对象的 next()方法，并将迭代器返回的结果对象中的 value 属性存储在一个变量中，循环将持续执行这一过程直到返回对象的 done 为 true。

```js
let arr = [1, 2, 3]

for (const num of arr) {
  console.log(num)
}
// 1
// 2
// 3
```

:::warning
如果将 for-of 语句用于不可迭代对象、null、undefined 将会导致程序抛出错误。
:::

### 访问默认迭代器

可以通过 Symbol.iterator 来访问对象默认的迭代器

```js {2}
let arr = [1, 2, 3]
let iterator = arr[Symbol.iterator]()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: false }
```

由于具有 Symbol.iterator 属性的对象都有默认的迭代器，因此可以用它来检测对象是否为可迭代对象

```js {2}
function isIterable(obj) {
  return typeof obj[Symbol.iterator] === 'function'
}

console.log(isIterable([1, 2])) // true
console.log(isIterable('hello')) // true
console.log(isIterable(new Map())) // true
console.log(isIterable(new Set())) // true
console.log(isIterable(new WeakMap())) // false
console.log(isIterable(new WeakSet())) // false
```

### 创建可迭代对象

默认情况下，开发者定义的对象都是不可迭代对象，但如果给 Symbol.iterator 属性添加一个生成器，则可以将它变为可迭代对象。

```js
let obj = {
  items: [],
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item
    }
  },
}
obj.items.push(1)
obj.items.push(2)
obj.items.push(3)

for (const x of obj) {
  console.log(x)
}
// 1
// 2
// 3
```

在这个例子中，先创建一个生成器并将其赋值给对象的 Symbol.iterator 属性来创建默认的迭代器；在生成器中，通过 for-of 循环迭代 this.items 并用 yield 返回里面的每一个值。obj 对象默认迭代器的返回值由迭代器 this.items 字段生成，而非手动遍历来定义返回值。

## 内建迭代器

ECMAScript 6 中已经默认为许多内建类型提供了内建迭代器。

## 集合对象迭代器

在 es6 中有三种类型的集合对象：数组、Set、Map，这三种对象都内建了以下三种迭代器。

- entries() 返回一个迭代器，其值为多个键值对
- values() 返回一个迭代器，其值为集合中的值
- keys() 返回一个迭代器，其值为集合中的所有键名

### entries() 迭代器

每次调用 next()方法时，entries() 迭代器都会返回一个数组，数组的两个元素分别表示集合中每个元素的键与值。

- 遍历对象是数组：第一个元素是数字类型的索引
- 遍历对象是 Set：第一个元素与第二个元素都是值（Set 集合中的值被同时作为键和值使用）
- 遍历对象是 Map：第一个元素为键名

```js {3,12,22}
let array = ['red', 'blue', 'green']

for (const iterator of array.entries()) {
  console.log(iterator)
}
// [ 0, 'red' ]
// [ 1, 'blue' ]
// [ 2, 'green' ]

let set = new Set([123, 321])

for (const iterator of set.entries()) {
  console.log(iterator)
}
// [ 123, 123 ]
// [ 321, 321 ]

let map = new Map()
map.set('title', '标题')
map.set('content', '内容')

for (const iterator of map.entries()) {
  console.log(iterator)
}
// [ 'title', '标题' ]
// [ 'content', '内容' ]
```

### values() 迭代器

```js {3,12,22}
let array = ['red', 'blue', 'green']

for (const iterator of array.values()) {
  console.log(iterator)
}
// red
// blue
// green

let set = new Set([123, 321])

for (const iterator of set.values()) {
  console.log(iterator)
}
// 123
// 321

let map = new Map()
map.set('title', '标题')
map.set('content', '内容')

for (const iterator of map.values()) {
  console.log(iterator)
}
// 标题
// 内容
```

### keys() 迭代器

```js {3,12,22}
let array = ['red', 'blue', 'green']

for (const iterator of array.keys()) {
  console.log(iterator)
}
// 0
// 1
// 2

let set = new Set([123, 321])

for (const iterator of set.keys()) {
  console.log(iterator)
}
// 123
// 321

let map = new Map()
map.set('title', '标题')
map.set('content', '内容')

for (const iterator of map.keys()) {
  console.log(iterator)
}
// title
// content
```

### 不同集合类型的默认迭代器

每个集合类型都有一个默认的迭代器，在 for-of 循环中，如果没有显式的指定则使用默认的迭代器。数组和 Set 的默认迭代器是 values()方法，Map 的默认迭代器是 entries()。

```js {3,12,22}
let array = ['red', 'blue', 'green']

for (const iterator of array) {
  console.log(iterator)
}
// red
// blue
// green

let set = new Set([123, 321])

for (const iterator of set) {
  console.log(iterator)
}
// 123
// 321

let map = new Map()
map.set('title', '标题')
map.set('content', '内容')

for (const iterator of map) {
  console.log(iterator)
}
// [ 'title', '标题' ]
// [ 'content', '内容' ]
```

### 解构与 for-of 循环

可以利用 Map 的默认构造函数的行为来简化编码过程

```js {6}
let map = new Map()
map.set('title', '标题')
map.set('content', '内容')

// 与使用map.entries()方法相同
for (const [key, value] of map) {
  console.log(key + ':' + value)
}
```

处理 Map 集合外，也可将 for-of 循环中的解构方法应用于 Set 集合和数组。

### 字符串迭代器

字符串也是可迭代的，所以也可用 for-of 循环遍历。

```js
let msg = 'ab你好c'

for (const s of msg) {
  console.log(s)
}
// a
// b
// 你
// 好
// c
```

### NodeList 迭代器

DOM 定义中的 NodeList 类型（定义在 HTML 标准非 ECMAScript 6 标准中）也有默认迭代器。其行为与数组的默认迭代器完全一致。

```js
var divs = document.getElementsByTagName('div')

for (const div of divs) {
  console.log(div.id)
}
```

## 高级迭代器的功能

## 给迭代器传递参数

如果给迭代器的 next() 方法传递参数，则这个参数的值就会替代生成器内部上一条 yield 语句的返回值。

```js {2,4,6}
function* createIterator() {
  let one = yield 1

  let two = yield one + 2 // 4 + 2

  yield two + 3 // 5 + 3
}

let iterator = createIterator()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false }
console.log(iterator.next(5)) // { value: 8, done: false }
console.log(iterator.next()) // { value: undefined, done: false }
```

:::tip
特例，第一次调用 next() 方法时，无论传入什么参数都会被丢弃。由于传给 next()的参数会替代上一次 yield 的返回值，因此在第一次调用 next()方法时传递参数是毫无意义的。
:::

## 在迭代器中抛出错误，throw()

通过 throw() 方法，当迭代器恢复执行时可领其抛出一个错误，这种主动抛出错误的能力对于异步编程而言至关重要，也能为你提供模拟结束函数执行的两种方法（返回值或抛出错误），从而增强生成器内部的编程弹性。<br>
将错误对象传给 throw()方法后，在迭代器继续执行时会被抛出。

```js {3,11}
function* createIterator() {
  let one = yield 1
  let two = yield one + 2 // yield 4 + 2，然后抛出错误
  yield two + 3 // 5 + 3
}

let iterator = createIterator()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false }
console.log(iterator.throw(new Error('err'))) // 从生成器中抛出错误
```

知道调用 throw()方法后生成器内部抛出错误的位置，就可以通过 try-catch 代码块来捕捉这些错误。

```js {5-9,18}
function* createIterator() {
  let one = yield 1
  let two

  try {
    two = yield one + 2 // yield 4 + 2，然后抛出错误
  } catch (error) {
    two = 6 // 如果捕获到错误，则给 two 赋值6
  }

  yield two + 3 // 6 + 3
}

let iterator = createIterator()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next(4)) // { value: 6, done: false }
console.log(iterator.throw(new Error('err'))) // { value: 9, done: false }
console.log(iterator.next(4)) // { value: undefined, done: false }
```

:::warning
调用 throw()方法后也会像调用 next()方法一样返回一个结果对象。
:::

:::tip
在迭代器内部，如果使用了 yield 语句，则可以通过 next() 和 threw() 方法控制执行过程。<br>
当然也可以使用 return 语句返回一些与普通函数返回语句不一样的内容。
:::

## 生成器返回语句 reutrn

在生成器中，return 表示所有操作已经完成，属性 done 被设置成 true，如果同时提供了值，相应的 value 会被设置成这个值。

```js {3,9}
function* createIterator() {
  yield 1
  return 2
  yield 3
}

let iterator = createIterator()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: true }
console.log(iterator.next()) // { value: undefined, done: true }
```

return 后续的 yield 语句不会被执行，通过 return 语句指定的返回值，只会在返回对象中出现一次，在后续调用中 value 属性还是会被重置为 undefined。

## 委托生成器 yield \*

某些情况下，我们需要将几个迭代器合成一个，这时可以创建一个生成器，再给 yield 语句添加一个 星号，就可以将生成数据的过程委托给其他迭代器。只需要将（\*）放在关键字 yield 和生成器函数名之间即可。<br>
`yield*`表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。

```js {12,14}
function* createNumIterator() {
  yield 1
  yield 2
  return 3
}
function* createRepeatIterator(count) {
  for (let i = 0; i < count; i++) {
    yield 'repeat'
  }
}
function* createCombineIterator() {
  let result = yield* createNumIterator()
  // 接收上一个生成器的return返回值作为另一个生成器的参数
  yield* createRepeatIterator(result)
}

let iterator = createCombineIterator()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 'repeat', done: false }
console.log(iterator.next()) // { value: 'repeat', done: false }
console.log(iterator.next()) // { value: 'repeat', done: false }
console.log(iterator.next()) // { value: undefined, done: false }
```

:::tip
任何数据结构只要有 Iterator 迭代器接口，就可以被 yield \*遍历。
:::

## 异步任务执行

执行异步操作的传统方式一般是调用一个函数并执行相应的回调函数。如果要嵌套回调或序列化一系列异步操作，会变得非常复杂，此时 生成器和 yield 语句就派上用场了。

### 简单任务执行器

由于执行 yield 语句会暂停当前函数的执行过程并等待下一次调用 next() 方法，因此可以创建一个函数，在函数中调用生成器生成相应的迭代器，从而在不用回调函数的基础上实现异步调用 next() 方法

```js
function run(taskDef) {
  // 创建一个无限使用的迭代器
  let task = taskDef()
  // 开始执行任务
  let result = task.next()

  // 循环调用next()
  function step() {
    // 如果任务未完成，继续执行
    if (!result.done) {
      result = task.next()
      step()
    }
  }
  // 开始迭代执行
  step()
}

run(function*() {
  console.log(1)
  yield
  console.log(2)
  yield
  console.log(3)
})
```

### 向任务执行器传递数据

给任务执行器传递数据最简单的办法是，把 yield 返回的值传入下一次 next()方法中调用。

```js {11}
function run(taskDef) {
  // 创建一个无限使用的迭代器
  let task = taskDef()
  // 开始执行任务
  let result = task.next()

  // 循环调用next()
  function step() {
    // 如果任务未完成，继续执行
    if (!result.done) {
      result = task.next(result.value)
      step()
    }
  }
  // 开始迭代执行
  step()
}

run(function*() {
  let value = yield 1
  console.log(value) // 1

  value = yield value + 3
  console.log(value) // 4
})
```

将 result.value 作为 next()方法的参数传入，这样就可以在 yield 调用之间传递数据了。

### 异步任务执行器

```js {11-22,34-36,41-42}
function run(taskDef) {
  // 创建一个无限使用的迭代器
  let task = taskDef()
  // 开始执行任务
  let result = task.next()

  // 循环调用next()
  function step() {
    // 如果任务未完成，继续执行
    if (!result.done) {
      if (typeof result.value === 'function') {
        // 传入回调函数调用它
        result.value(function(err, data) {
          if (err) {
            result = task.throw(err)
            return
          }

          result = task.next(data)
          step()
        })
      }
    } else {
      result = task.next(result.value)
      step()
    }
  }
  // 开始迭代执行
  step()
}
// 异步函数
function fetchData() {
  return function(callback) {
    setTimeout(() => {
      callback(null, 'hello')
    }, 1000)
  }
}

run(function*() {
  let res = yield fetchData() // 此处等待1s返回结果
  console.log(res) // hello
})
```

如果 result.value 是一个函数，就会传入一个回调函数作为参数来调用它，回调函数的结果放在第二个参数 data 里。
:::tip
使用 yield 生成的特性来等待异步操作的完成，使代码和同步代码完全一样。
:::
