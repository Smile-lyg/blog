---
title: JS基础：async函数
date: 2021-06-12
tags:
  - JavaScript
categories:
  - es6
---

:::tip
async 函数是什么？一句话，它就是 Generator 函数的语法糖。
:::

## async 函数对 Generator 函数的改进，体现在以下四点。

1. 内置执行器。

   - Generator 函数的执行必须靠执行器，所以才有了 co 模块
   - 而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

2. 更好的语义。

   - sync 和 await，比起星号和 yield，语义更清楚了。
   - async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

3. 更广的适用性。

   - co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象
   - 而 async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

4. 返回值是 **Promise**。

   - async 函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用 then 方法指定下一步的操作。
   - 进一步说，async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。

## 语法

- async 函数就是将 Generator 函数的星号（\*）替换成 async，将 yield 替换成 await，仅此而已。
- async 函数返回一个 Promise 对象。
- async 函数内部 return 语句返回的值，会成为 then 方法回调函数的参数。

```js
async function demo() {
  let a = await Promise.resolve(1)
  await 2
  return 123
}
demo()
  .then((v) => console.log(v)) // 123
  .catch((e) => console.log(e))
```

- async 函数没有显式的 resolve，内部调用了.then()，如果没有写 return 语句，默认 **return undefined**

```js
async function demo() {
  let a = await Promise.resolve(1)
}
demo()
  .then((v) => console.log(v)) // undefined
  .catch((e) => console.log(e))
///////////
async function demo() {
  let a = await Promise.resolve(1)
  return a
}
demo()
  .then((v) => console.log(v)) // 1
  .catch((e) => console.log(e))
```

- async 函数内部抛出错误，会导致返回的 Promise 对象变为 reject 状态。抛出的错误对象会被 catch 方法回调函数接收到。

```js
async function demo() {
  throw new Error('出错了')
}
demo().then(
  (v) => console.log(v),
  (e) => console.log(e) // Error: 出错了
)
```

## 基本用法

- async 函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到 return 语句或者抛出错误。也就是说，只有 async 函数内部的异步操作执行完，才会执行 then 方法指定的回调函数。

```js
async function demo() {
  let a = await new Promise((resolve, reject) => {
    setTimeout(() => resolve(123), 2000) // 成功
  })
  let b = await new Promise((resolve, reject) => {
    resolve(a * 10)
  })
  return b
}
demo()
  .then((v) => console.log(v)) // 等待2秒输出：1230
  .catch((e) => console.log(e))
```

- 任何一个 await 语句后面的 Promise 对象变为 reject 状态，那么**整个 async 函数都会中断执行**。

```js
async function demo() {
  let a = await new Promise((resolve, reject) => {
    setTimeout(() => reject(123), 2000) // 失败，直接到catch
  })
  // 以下不会执行
  let b = await new Promise((resolve, reject) => {
    resolve(a * 10)
  })
  return b
}
demo()
  .then((v) => console.log(v))
  .catch((e) => console.log('error：', e)) // 等待2秒输出：error: 123
```

- 有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个 await 放在 try...catch 结构里面，这样不管这个异步操作是否成功，第二个 await 都会执行。

```js
async function demo() {
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => reject(123), 2000) // 失败
    })
  } catch {}
  // 继续执行
  let b = await new Promise((resolve, reject) => {
    resolve(10)
  })
  return b
}
demo()
  .then((v) => console.log(v)) // 10
  .catch((e) => console.log('error：', e))
```

- 另一种方法是 await 后面的 Promise 对象再跟一个 catch 方法，处理前面可能出现的错误。

```js
async function demo() {
  await new Promise((resolve, reject) => {
    setTimeout(() => reject(123), 2000) // 失败，catch
  }).catch((e) => console.log('e:', e)) // e: 123
  // 继续执行
  let b = await new Promise((resolve, reject) => {
    resolve(10)
  })
  return b
}
demo()
  .then((v) => console.log(v)) // 10
  .catch((e) => console.log('error：', e))
```

## 使用注意点

1. 第一点，前面已经说过，await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。
2. 第二点，多个 await 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发
3. 第三点，await 命令只能用在 async 函数之中，如果用在普通函数，就会报错。
4. 第四点，async 函数可以保留运行堆栈。
