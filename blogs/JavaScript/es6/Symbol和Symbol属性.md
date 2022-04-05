---
title: es6：Symbol和Symbol属性
date: 2022-04-05
tags:
  - JavaScript
categories:
  - es6
---

## JavaScript 数据类型

字符型（String）、数字型（Number）、布尔型（Boolean）、null、undefined、Symbol
大整数（BigInt）、对象（Object）

::: tip
ES6 引入了一种新的原始数据类型**Symbol**，表示独一无二的值
:::

## 创建 Symbol

Symbol 值通过 Symbol()函数生成。

```js
let s = Symbol()
console.log(typeof s) // symbol
```

::: warning
注意，Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。
也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。
:::
Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，这段描述不可用于属性访问，但是建议每次创建 Symbol 的时候加上这个描述，便于阅读代码和调试 Symbol 程序。

ES2019 提供了一个实例属性 description，直接返回 Symbol 的描述。

```js
let s1 = Symbol('foo')
let s2 = Symbol('bar')

console.log(s1) // Symbol(foo)
console.log(s2.toString()) // Symbol(bar)

// ES2019提供了一个实例属性description，直接返回 Symbol 的描述。
console.log(s1.description) // foo
```

## Symbol 的使用

## 作为属性名的 Symbol

由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

```js{17}
let mySymbol = Symbol()

// 第一种写法
let a = {}
a[mySymbol] = 'Hello!'

// 第二种写法
let a = {
  [mySymbol]: 'Hello!',
}

// 第三种写法
let a = {}
Object.defineProperty(a, mySymbol, { value: 'Hello!' })

// 以上写法都得到同样结果
console.log(a[mySymbol]) // "Hello!"
```

::: warning
注意，Symbol 值作为对象属性名时，不能用点运算符。
同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
:::

### 属性名的遍历

注意：Symbol 作为属性名，遍历对象的时候，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。

但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols()方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

```js{6}
let mySymbol = Symbol('1')
let a = {
  [mySymbol]: 'Hello!',
}

console.log(Object.getOwnPropertySymbols(a)) // [ Symbol(1) ]
```

另一个新的 API，Reflect.ownKeys() 方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。

```js{6}
let mySymbol = Symbol('1')
let a = {
  [mySymbol]: 'Hello!',
  type: 'abc',
}
console.log(Reflect.ownKeys(a)) // [ 'type', Symbol(1) ]
```

::: tip
由于以 Symbol 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
:::

## Symbol.for()

有时，我们希望重新使用同一个 Symbol 值，Symbol.for() 可以做到。
Symbol.for() 接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。

```js{4}
let s1 = Symbol.for('foo')
let s2 = Symbol.for('foo')

console.log(s1 === s2) // true
```

::: tip
Symbol.for()与 Symbol()这两种写法，都会生成新的 Symbol。<br/>
它们的区别是，前者会被登记在全局环境中供搜索，后者不会。<br/>
Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的 key 是否已经存在，如果不存在才会新建一个值。<br/>
比如，如果你调用 Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用 Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。
:::

```js
console.log(Symbol.for('bar') === Symbol.for('bar')) // true

console.log(Symbol('bar') === Symbol('bar')) // false
```

## Symbol.keyFor()

Symbol.keyFor() 法返回一个**已登记**的 Symbol 类型值的 key。

```js{3}
let s1 = Symbol.for('foo')
console.log(Symbol.keyFor(s1)) // foo

let s2 = Symbol('foo')
console.log(Symbol.keyFor(s2)) // undefined
```

## 内置的 Symbol 值

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。

### Symbol.hasInstance

每个函数中都有一个 Symbol.hasInstance 方法，用于确定对象是否为函数的实例，接收一个参数，即要检查的值，如果传入的值是函数的实例，则返回 true。

```js
obj instanceof Array
// 等价于
Array[Symbol.hasInstance](obj)
```

本质上，es6 只是将 instanceof 操作符重新定义为此方法的简写语法。

### Symbol.isConcatSpreadable

对象的 Symbol.isConcatSpreadable 属性等于一个布尔值，表示该对象用于 Array.prototype.concat()时，是否可以展开。

```js
let arr1 = ['c', 'd']
;['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd']
arr2[Symbol.isConcatSpreadable] = false
;['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```

上面代码说明，数组的默认行为是可以展开，Symbol.isConcatSpreadable 默认等于 undefined。该属性等于 true 时，也有展开的效果。

类似数组的对象正好相反，默认不展开。它的 Symbol.isConcatSpreadable 属性设为 true，才可以展开。

### Symbol.species

对象的 Symbol.species 属性，指向一个构造函数。创建衍生对象时，会使用该属性。

### Symbol.match

对象的 Symbol.match 属性，指向一个函数。当执行 str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。

### Symbol.replace

对象的 Symbol.replace 属性，指向一个方法，当该对象被 String.prototype.replace 方法调用时，会返回该方法的返回值。

### Symbol.search

对象的 Symbol.search 属性，指向一个方法，当该对象被 String.prototype.search 方法调用时，会返回该方法的返回值。

### Symbol.split

对象的 Symbol.split 属性，指向一个方法，当该对象被 String.prototype.split 方法调用时，会返回该方法的返回值。

### Symbol.iterator

对象的 Symbol.iterator 属性，指向该对象的默认遍历器方法。

### Symbol.toPrimitive

对象的 Symbol.toPrimitive 属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

### Symbol.toStringTag

对象的 Symbol.toStringTag 属性，指向一个方法。在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制[object Object]或[object Array]中 object 后面的那个字符串。

### Symbol.unscopables

对象的 Symbol.unscopables 属性，指向一个对象。该对象指定了使用 with 关键字时，哪些属性会被 with 环境排除。
