---
title: es6：Set集合
date: 2022-04-06
tags:
  - JavaScript
  - Set
categories:
  - es6
---

ECMAScript 6 中新增的 Set 类型是一种有序列表，其中含有一些相互独立的非重复值，通过 set 集合可以快速访问其中的数据。

## 基本用法

### 创建集合并添加元素

Set 本身是一个构造函数，用来生成 Set 数据结构。

```js {1}
let set = new Set()

set.add(5) // 1
set.add('5') // 2

// 3
set.add(NaN)
set.add(NaN)

set.add({}) // 4
set.add({}) // 5

console.log(set.size) // 5
```

:::tip
向 Set 加入值的时候，不会发生类型转换，所以 5 和"5"是两个不同的值。<br>
(Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为 NaN 等于自身，而精确相等运算符认为 NaN 不等于自身。)<br>
在 Set 内部，两个 NaN 是相等的。<br>
另外，两个对象总是不相等的。
:::

使用 Set 去重。

```js {3,8}
// 去除数组的重复成员
let arr = [3, 5, 2, 2, 5, 5]
let unique = [...new Set(arr)]
console.log(unique)
// [3, 5, 2]

// 去除字符串里面的重复字符。
let s = [...new Set('ababbc')].join('')
console.log(s)
// "abc"
```

## Set 实例的属性和方法

1. Set 结构的实例有以下属性。

- Set.prototype.constructor：构造函数，默认就是 Set 函数。
- Set.prototype.size：返回 Set 实例的成员总数。

2. Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。

### 操作方法。

- Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
- Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- Set.prototype.has(value)：返回一个布尔值，表示该值是否为 Set 的成员。
- Set.prototype.clear()：清除所有成员，没有返回值。

### 遍历方法

Set 结构的实例有四个遍历方法，可以用于遍历成员。

- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员

::: tip
需要特别指出的是，Set 的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
:::

```js {1,3,10,17,24,31}
let set = new Set(['red', 'green', 'blue'])

for (let item of set) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.keys()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item)
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

set.forEach((value, key) => console.log(key + ' : ' + value))
// red : red
// green : green
// blue : blue
```

:::warning
注意，Set 结构的键名就是键值（两者是同一个值）
:::

## WeakSet

[WeakSet](https://es6.ruanyifeng.com/#docs/set-map#WeakSet)

WeakSet 集合（弱引用集合）。WeakSet 集合只存储**对象**的弱引用，并且不可以存储**原始值**，只能是对象；集合中的弱引用如果是对象唯一的引用，则会被回收并释放相应的内存。

### 创建 WeakSet 集合

用 WeakSet 构造函数可以创建 WeakSet 集合，集合支持 3 个方法：add()、has()、delete()。

```js {1,4,7,12}
let set = new WeakSet()
let key = {}

set.add(key)
console.log(set.has(key)) // true

set.delete(key)
console.log(set.has(key)) // false

let key1 = {},
  key2 = {},
  set1 = new WeakSet([key1, key2])

console.log(set1.has(key1)) // true
console.log(set1.has(key2)) // true
```

### 和普通 Set 的区别

- 在 WeakSet 的实例中，如果向 add() 方法传入非对象参数会导致程序报错，而向 has() 和 delete() 方法传入非对象参数则会返回 false。
- WeakSet 集合不可迭代，所以不能被用于 for-of 循环。
- WeakSet 集合不暴露任何迭代器（例如 keys()和 values()方法），所以无法通过本身程序来监测其中的内容。
- WeakSet 集合不支持 forEach()方法。
- WeakSet 集合不支持 size 属性。

WeakSet 集合功能看似受限，其实这是为了让它能够正确的处理内存中的数据。
总之，如果你只需要跟踪对象引用，更应该使用 WeakSet。
