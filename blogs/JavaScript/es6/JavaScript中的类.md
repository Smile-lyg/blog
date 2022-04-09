---
title: JavaScript中的类
date: 2022-04-09
tags:
  - JavaScript
  - Class
categories:
  - es6
---

## ECMAScript 5 中的近类结构

在 ECMAScript 5 及早期版本中没有类的概念。最相近的思路是创建一个自定义类型：首先创建一个构造函数，然后定义另一个方法并赋值给构造函数的原型。

```js {12-13}
function PersonType(name) {
  this.name = name
}

PersonType.prototype.sayName = function() {
  console.log(this.name)
}

var person = new PersonType('张三')
person.sayName() // 张三

console.log(person instanceof PersonType) // true
console.log(person instanceof Object) // true
```

由于存在原型继承的特性，person 对象是 personType 的实例也是 Object 的实例。

## 类的声明语法

要声明一个类，首先编写 class 关键字，紧跟着类的名字，其他部分类似于对象字面量方法的简写形式，但不需要在类的各个元素之间使用逗号。

```js {15-16,18-19}
class PersonClass {
  // 等价于 PersonType构造函数
  constructor(name) {
    this.name = name
  }
  // 等价于PersonType.prototype.sayName
  sayName() {
    console.log(this.name)
  }
}

let person = new PersonClass('张三')
person.sayName() // 张三

console.log(person instanceof PersonClass) // true
console.log(person instanceof Object) // true

console.log(typeof PersonClass) // function
console.log(typeof PersonClass.prototype.sayName) // function
```

::: tip
类的声明仅仅是基于已有的自定义类型声明的语法糖。typeof PersonClass 最终返回的结果是 function，所有 PersonClass 声明实际上创建了一个具有构造函数方法行为的函数，sayName() 方法实际上是 PersonClass.prototype 上的一个方法。通过语法糖包装后，类就可以代替自定义类型的功能。
:::

::: warning
与函数不同的是，类属性不可被赋予新值，在之前的示例中，PersonClass.prototype 就是这样一个只读的属性。
:::

### 为何使用类语法

尽管类和自定义类型之间有诸多相似之处，但是它们还是有差异的。

- 函数声明可以被提升，而类声明与 let 声明类似，不能被提升，真正执行声明语句前，它们会一直存在于临时死区中。
- 类声明中的所有代码将自动运行在严格模式下。
- 在自定义类型中，需要通过 Object.defineProperty() 方法手工指定某个方法为不可枚举；而在类中，所有方法都是不可枚举的。
- 每个类都有一个名为[[Construct]]的内部方法，通过关键字 new 调用那些不含[[Construct]]的方法会导致程序抛出错误。
- 使用除关键字 new 以外的方式调用类的构造函数会导致程序抛出错误。
- 在类中修改类名会导致程序报错。
  使用除类之外的语法实现 PersonClass

```js {23}
// 等价于PersonClass
let PersonType2 = (function() {
  'use strict'
  const PersonType2 = function(name) {
    // 确保通过关键字new调用函数
    if (typeof new.target === 'undefined') {
      throw new Error('必须通过关键字new调用函数')
    }
    this.name = name
  }
  Object.defineProperty(PersonType2.prototype, 'sayName', {
    value: function() {
      // 确保不会通过new关键字调用该方法
      if (typeof new.target !== 'undefined') {
        throw new Error('不可使用new关键字调用该方法')
      }
      console.log(this.name)
    },
    enumerable: false,
    writable: true,
    configurable: true,
  })
  return PersonType2
})()

let person = new PersonType2('张三')
person.sayName() // 张三
```

尽管可以在不使用 class 语法的前提下实现类的所有功能，但代码将会变得极为复杂。

## 类表达式语法

函数和类都有两种存在形式：声明形式和表达式形式。声明形式的函数和类都由相应的关键字（function 和 class）进行定义，随后紧跟一个标识符；表达式形式的函数和类与之类似，只是不需要在关键字后面添加标识符。

```js {2}
// 匿名类声明
let PersonClass = class {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log(this.name)
  }
}

let person = new PersonClass('张三')
person.sayName() // 张三
```

## 作为一等公民的类

在程序中，一等公民是指一个可以传入函数，可以从函数返回，并且可以赋值给变量的值。JavaScript 函数时一等公民，es6 延续了这个传统将类也设计为一等公民，允许通过多种方式使用类的特性。<br>
例如，可将类作为参数传入函数之中。

```js
function createObject(classDef) {
  return new classDef()
}

let obj = createObject(
  class {
    say() {
      console.log('Hi')
    }
  }
)

obj.say() // Hi
```

类表达式还有另一种使用方式，通过立即调用类构造函数可以创建单例。用 new 调用类表达式，紧接着通过一对小括号调用这个表达式。

```js {1,8}
let person = new (class {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log(this.name)
  }
})('jack')

person.sayName() // jack
```

## 访问器属性

尽管应该在类构造函数中创建自己的属性，但是类也支持直接在原型上定义访问器属性。创建 getter 和 setter 时，需要在关键字后紧跟一个空格和相应的标识符。

```js {5,8,18-20}
class CustomHTMLElement {
  constructor(ele) {
    this.element = ele
  }
  get html() {
    return this.element.innerHTML
  }
  set html(value) {
    this.element.innerHTML = value
  }
}

let descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype,
  'html'
)

console.log('get' in descriptor) // true
console.log('set' in descriptor) // true
console.log(descriptor.enumerable) // false
```

这段代码中的 CustomHTMLElement 类是一个针对现有 DOM 元素的包装器，并通过 getter 和 setter 方法将这个元素的 innerHTML 方法委托给 html 属性，这个访问器属性是在 CustomHTMLElement.prototype 上创建的。与其他方法一样，创建时声明该属性不可枚举。
<br>下面是非类形式的等价实现

```js
let CustomHTMLElement = (function() {
  'use strict'
  const CustomHTMLElement = function(ele) {
    // 确保通过关键字new调用该函数
    if (typeof new.target === 'undefined') {
      throw new Error('必须通过关键字new调用构造函数')
    }
    this.element = ele
  }
  Object.defineProperty(CustomHTMLElement.prototype, 'html', {
    enumerable: false,
    configurable: true,
    get: function() {
      return this.element.innerHTML
    },
    set: function(value) {
      this.element.innerHTML = value
    },
  })
  return CustomHTMLElement
})()
```

由上可见，比起非类等效实现，类语法可以节省很多代码。

## 可计算成员名称

类和对象字面量还有更多相似之处，类方法和访问器属性也支持使用可计算名称，就像在对象字面量中一样，用方括号包裹一个表达式即可使用计算名称。

```js {1,6,11}
let methodName = 'sayName'
class PersonClass {
  constructor(name) {
    this.name = name
  }
  [methodName]() {
    console.log(this.name)
  }
}
let person = new PersonClass('jack')
person.sayName() // jack
```

## 生成器方法

在对象字面量中，可以通过在方法名前面附加一个星号（\*）的方式定义生成器，在类中也是如此，可以将任意方法定义成生成器。

```js {2, 10-11}
class MyClass {
  *creatrIterator() {
    yield 1
    yield 2
    yield 3
  }
}

let instance = new MyClass()
let iterator = instance.creatrIterator()
console.log(iterator.next().value) // 1
```

如果你的类是用来表示值的集合的，可以定义一个默认迭代器，即可通过简单的方法迭代集合中的值。

```js {5-7, 14-16}
class Collection {
  constructor() {
    this.items = []
  }
  *[Symbol.iterator]() {
    yield* this.items.values()
  }
}
let collection = new Collection()
collection.items.push(1)
collection.items.push(2)
collection.items.push(3)

for (const x of collection) {
  console.log(x)
}
// 1
// 2
// 3
```

## 静态成员

在 ECMAScript 5 及早期版本中，直接将方法添加到构造函数中来模拟静态成员。

```js {5,9}
function PersonType(name) {
  this.name = name
}
// 静态方法
PersonType.create = function(name) {
  return new PersonType(name)
}
// 实例方法
PersonType.prototype.sayName = function() {
  console.log(this.name)
}
let person = PersonType.create('jack')
person.sayName() // jack
```

ECMAScript 6 的类语法简化了创建静态成员的过程，在方法或访问器属性名前面使用正式的静态注释 static 即可。

```js {11,15}
class PersonClass {
  // 等价于 PersonType 构造函数
  constructor(name) {
    this.name = name
  }
  // 等价于 PersonT.prototype.sayName
  sayName() {
    console.log(this.name)
  }
  // 等价于 PersonType.create
  static create(name) {
    return new PersonClass(name)
  }
}
let person = PersonClass.create('jack')
person.sayName() // jack
```

:::warning
不可在实例中访问静态成员，必须直接在类中访问静态成员。
:::

## 继承与派生类

在 ECMAScript 6 之前，实现继承与自定义类型需要多个步骤实现。

```js {12,15}
// 矩形
function Rectangle(length, width) {
  this.length = length
  this.width = width
}
// 计算面积方法
Rectangle.prototype.getArea = function() {
  return this.length * this.width
}
// 正方形
function Square(length) {
  Rectangle.call(this, length, length)
}
// 重写 Square.prototype
Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    value: Square,
    enumerable: true,
    writable: true,
    configurable: true,
  },
})

var square = new Square(3)

console.log(square.getArea()) // 9
console.log(square instanceof Square) // true
console.log(square instanceof Rectangle) // true
```

要实现 Square 继承自 Rectangle，必须用创建自 Rectangle.prototype 的新对象，重写 Square.prototype，并调用 Rectangle.call() 方法。这里不太容易理解，容易出错<br>
类的出现让我们可以更轻松的实现继承功能，使用熟悉的 extends 关键字可以指定继承的函数。原型会自动调整，通过调用 super() 方法即可访问基类的构造函数。

```js {11-16}
class Rectangle {
  constructor(length, width) {
    this.length = length
    this.width = width
  }
  getArea() {
    return this.length * this.width
  }
}

class Square extends Rectangle {
  constructor(length) {
    // 等价于 Rectangle.call(this, length, length)
    super(length, length)
  }
}

var square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Square) // true
console.log(square instanceof Rectangle) // true
```

继承自其他类的类被称作派生类，如果在派生类中指定了构造函数，则必须要调用 super()，如果不这样做程序会报错。如果选择不使用构造函数，则当创建新的类实例时会自动调用 super() 并传入所有参数。

```js
class Square extends Rectangle {
  // 没有构造函数
}
// 等价于
class Square extends Rectangle {
  constructor(...args) {
    super(...args)
  }
}
```

最好手动定义构造函数。
:::tip
使用 super 的注意点

- 只可在派生类的构造函数中使用 super()，如果尝试在非派生类（不是用 extends 声明的类）或函数中使用会导致程序抛出错误
- 在构造函数中访问 this 之前一定要调用 super()，它负责初始化 this，如果在调用 super()之前尝试访问 this 会导致程序出错。
- 如果不想调用 super()，则唯一的方法是让类的构造函数返回一个对象。

:::

## 类方法遮蔽

派生类中的方法总会覆盖基类中的同名方法。如果想调用基类中的该方法可以调用 super.方法名。

```js {7}
class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
  // 遮蔽并调用 Rectangle.prototype.getArea()
  getArea() {
    return super.getArea()
  }
}
```

## 静态成员继承

如果基类中有静态成员，那么这些静态成员在派生类中也可以使用。

```js {9, 10,11,21}
class Rectangle {
  constructor(length, width) {
    this.length = length
    this.width = width
  }
  getArea() {
    return this.length * this.width
  }
  static create(length, width) {
    return new Rectangle(length, width)
  }
}

class Square extends Rectangle {
  constructor(length) {
    // 等价于 Rectangle.call(this, length, length)
    super(length, length)
  }
}

var rect = Square.create(3, 4)

console.log(rect instanceof Rectangle) // true
console.log(rect.getArea()) // 12
console.log(rect instanceof Square) // false
```

## 派生自表达式的类

ECMAScript 6 最强大的一面或许是从表达式导出类的功能了。只要表达式可以被解析为一个函数并且具有 [[Construct]]属性和原型，那么就可以使用 extends 进行派生。

```js {1,5,8}
function Rectangle(length, width) {
  this.length = length
  this.width = width
}
Rectangle.prototype.getArea = function() {
  return this.length * this.width
}
class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
}

var square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Rectangle) // true
```

extnds 强大的功能使得类可以继承自任意类型的表达式，从而创造更多可能性，例如动态地确定类的继承目标。例如：

```js {10-12, 14}
function Rectangle(length, width) {
  this.length = length
  this.width = width
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width
}

function getBase() {
  return Rectangle
}

class Square extends getBase() {
  constructor(length) {
    super(length, length)
  }
}

var square = new Square(3)
console.log(square.getArea()) // 9
console.log(square instanceof Rectangle) // true
```

由于可以动态确定使用那个基类，因此可以创建不同的继承方法。例如，可以像这样创建 mixin:

```js {13-17,19-25}
let SeriaizableMixin = {
  seriaize() {
    return JSON.stringify(this)
  },
}

let AreaMixin = {
  getArea() {
    return this.length * this.width
  },
}

function mixin(...mixins) {
  var base = function() {}
  Object.assign(base.prototype, ...mixins)
  return base
}

class Square extends mixin(SeriaizableMixin, AreaMixin) {
  constructor(length) {
    super()
    this.length = length
    this.width = length
  }
}

var square = new Square(3)
console.log(square.getArea()) // 9
console.log(square.seriaize()) // {"length":3,"width":3}
```

Square 的实例拥有来自 AreaMixin 对象的 getArea() 方法和来自 SeriaizableMixin 的 seriaize()方法，这都是通过原型继承实现的，mixin 函数会用所有 mixin 对象的自有属性动态填充新函数的原型。如果多个 mixin 对象具有相同的属性，那么只有最后一个被添加的属性被保留。
:::tip
在 extends 后可以使用任意表达式，但不是所有表达式最终都能生成合法的类。如果使用 null 或生成器函数会导致错误发生，类在这些情况下没有[[Construct]]属性，尝试为其创建新的实例会导致程序无法调用[[Construct]]而报错。
:::

## 内建对象的继承

开发者一直希望通过继承的方式创建属于自己的特殊数组，如，在早期使用传统的继承方式无法实现这样的功能

```js
// 内建数组行为
var colors = []
colors[0] = 'red'
console.log(colors.length) // 1

colors.length = 0
console.log(colors[0]) // undefined
```

::: tip
es6 中的继承模型与 es5 及早期版本中稍有不同，主要体现在

- 在 es5 的传统继承方式中，先由派生类型（如 MyArray)创建 this 的值，然后调用基类型的构造函数（如 Array.apply()方法）。这意味着，this 的值开始指向的是 MyArray 实例，但是随后会被来自 Array 的其他属性所修饰。
- es6 中的类继承则相反，先由基类（Array）创建 this 的值，然后派生类的构造函数再修改这个值。所以一开始可以通过 this 访问基类的所有内建功能，然后在正确地接收所有与之相关的功能。

:::

es6 中基于类则可以实现生成特殊数组。

```js
class MyArray extends Array {}

let colors = new MyArray()
colors[0] = 'red'
console.log(colors.length) // 1

colors.length = 0
console.log(colors[0]) // undefined
```

MyArray 自己继承自 Array，其行为也和 Array 很相似，操作数值型属性会更新 length 属性，操作 length 属性也会更新数值型属性。于是可以正确的继承 Array 对象来创建自己的派生数组类型，当然也可以继承其他的内建对象。

## Symbol.species 属性

内建对象继承的一个实用之处是，原本在内建对象中返回实例自身的方法将自动返回派生类的实例。

```js
class MyArray extends Array {}

let items = new MyArray(1, 2, 3, 4)
let subitems = items.slice(1, 3)

console.log(items instanceof MyArray) // true
console.log(subitems instanceof MyArray) // true
```

正常情况下继承自 Array 的 slice()应该返回 Array 实例，但是实际上却是返回的 MyArray 的实例。在浏览器引擎背后是通过 Symbol.species 属性实现这一行为。<br>
Symbol.species 是诸多内部 Symbol 中的一个，他被用于定义返回函数的静态访问器属性。被返回的函数是一个构造函数，每当要在实例的方法中创建类的实例时必须使用这个构造函数。以下这些内建类型均已定义 Symbol.species 属性

- Array
- ArrayBuffer
- Map
- Promise
- RegExp
- Set
- Typed arrays

列表中的每一个类型都有一个默认的 Symbol.species 属性，该属性的返回值为 this，这也意味着该属性总会返回构造函数。通过 Symbol.species 可以定义当派生类的方法返回实例时，应该返回的值的类型。<br>
例如

```js {2-4}
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array
  }
}

let items = new MyArray(1, 2, 3, 4)
let subitems = items.slice(1, 3)

console.log(items instanceof MyArray) // true
console.log(subitems instanceof Array) // true
console.log(subitems instanceof MyArray) // false
```

## 在类的构造函数中使用 new.target

在类的构造函数中也可以通过 new.target 来确定类是如何被调用的。
简单情况下 new.target 等于类的构造函数。

```js {3}
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle)
    this.length = length
    this.width = width
  }
}

var obj = new Rectangle(3, 4) // 输出 true
```

类构造函数必须通过 new 关键字调用，所以总在类的构造函数中定义 new.target 属性。但是其值会有所不同，如下

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle)
    this.length = length
    this.width = width
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length)
  }
}

var obj = new Square(3) // 输出 false
```

Square 调用 Rectangle 的构造函数，所以当调用发生时，new.target 等于 Square。
这一点非常重要，因为每个构造函数都可以根据自身被调用的方式改变自己的行为。<br>
例如可以用 new.target 创建一个抽象基类（不能被直接实例化的类，必须继承后才能使用的类），如下

```js {4-6, 18}
// 抽象基类
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('这个类不能被直接实例化')
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super()
    this.length = length
    this.width = width
  }
}

let x = new Shape() // 抛出错误

let y = new Rectangle(3, 4) // 没有错误
console.log(y instanceof Shape) // true
```

:::tip
因为类必须通过 new 关键字才能调用，所以在类的构造函数中，new.target 属性永远不会是 undefined。
:::
