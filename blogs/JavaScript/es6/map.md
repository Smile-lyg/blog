---
title: es6：Map集合
date: 2022-04-07
tags:
  - JavaScript
  - Map
categories:
  - es6
---

:::tip
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。<br>
为了解决这个问题，ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。
:::

```js {1,4,6}
const m = new Map()
const o = { p: 'hello' }

m.set(o, 'content')

console.log(m.get(o)) // content

console.log(m.has(o)) // true
console.log(m.delete(o)) // true
console.log(m.has(o)) // false
```

:::warning
如果对同一个键多次赋值，后面的值将覆盖前面的值。<br>
如果读取一个未知的键，则返回 undefined。<br>
:::

Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题
:::tip
如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键。<br>
比如 0 和-0 就是一个键，布尔值 true 和字符串 true 则是两个不同的键。另外，undefined 和 null 也是两个不同的键。虽然 NaN 不严格相等于自身，但 Map 将其视为同一个键。
:::

## 实例的属性和操作方法

## 属性

### size 属性

size 属性返回 Map 结构的成员总数。

### Map.prototype.set(key, value)

set 方法设置键名 key 对应的键值为 value，然后返回整个 Map 结构。如果 key 已经有值，则键值会被更新，否则就新生成该键。

### Map.prototype.get(key)

get 方法读取 key 对应的键值，如果找不到 key，返回 undefined。

### Map.prototype.has(key)

has 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

### Map.prototype.delete(key)

delete 方法删除某个键，返回 true。如果删除失败，返回 false。

### Map.prototype.clear()

clear 方法清除所有成员，没有返回值。

## 遍历方法

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历 Map 的所有成员。

需要特别注意的是，Map 的遍历顺序就是插入顺序。

## WeakMap

[WeakMap](https://es6.ruanyifeng.com/#docs/set-map#WeakMap)
:::tip
WeakMap 的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
<br>
总之，WeakMap 的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap 结构有助于防止内存泄漏。
:::
:::warning
注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
:::

WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。
WeakMap 与 Map 的区别有两点。

- 首先，WeakMap 只接受对象作为键名（null 除外），不接受其他类型的值作为键名。
- 其次，WeakMap 的键名所指向的对象，不计入垃圾回收机制。

```js
const wm1 = new WeakMap()
const key = { foo: 1 }

wm1.set(key, 2)
wm1.get(key) // 2
```

## 语法

WeakMap 与 Map 在 API 上的区别主要是两个，

- 没有遍历操作（即没有 keys()、values()和 entries()方法）
- 没有 size 属性.

eakMap 只有四个方法可用：get()、set()、has()、delete()。
