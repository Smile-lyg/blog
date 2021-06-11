---
title: JS基础：Promise
date: 2021-06-11
tags:
 - JavaScript
categories:
 - es6
---
## 什么是Promise
:::tip
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。<br>
所谓Promise，简单说就是一个**容器**，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。<br>
Promise对象有以下两个特点：
1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：**pending**（进行中）、**fulfilled**（已成功）和**rejected**（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从**pending**变为**fulfilled**和从**pending**变为**rejected**。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
:::
## 基本用法
- ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。
```js
const promise = new Promise(function (resolve, reject){
    // to do sth
    if(/* 异步操作成功 */){
        resolve(data) // 保存成功的结果
    }else{
        reject(data) // 保存失败的结果
    }
})
```
## Promise.prototype.then()
- Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
- then()方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。
```js
promise.then(function (value){
    // success
}, function (err){
    // failure
})
```
- .then()方法中没有显示return，就默认return undefined，ruturn 一个具体的值，就默认调用Promise.resolve(值)，将值保存到下一个promise的resolve中

## Promise.prototype.catch()
- Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
- .catch() 等于 .then(null,function(err){})

## Promise.prototype.finally() 
- finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。
```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```
## Promise.all() 
- Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。同时执行。
```js
const p = Promise.all([p1, p2, p3]);
```
- Promise.all()方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。
- p的状态由p1、p2、p3决定，分成两种情况。
    1. 只有p1、p2、p3的状态**都**变成**fulfilled**，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
    2. 只要p1、p2、p3之中有任意**一个**被**rejected**，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
## Promise.race()
- Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
- 只取最快完成的结果。
- 只要p1、p2、p3之中有**一个实例**率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
## Promise.resolve(), Promise.reject() 
- 有时需要将现有对象转为 Promise 对象
- 直接将promise状态设置成成功或者失败状态
```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
## Promise.allSettled() 
- Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。
```js
const promises = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];
await Promise.allSettled(promises);
removeLoadingIndicator();
```
- 上面代码对服务器发出三个请求，等到三个请求都结束，不管请求成功还是失败，加载的滚动图标就会消失。