---
title: JS基础：Class
date: 2021-06-12
tags:
  - JavaScript
categories:
  - es6
---

:::tip
ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
:::

- es5 构造函数

```js
function Person(name, age, sex) {
  this.name = name
  this.age = age
  this.sex = sex
  this.say = function() {
    console.log('my name is ' + this.name)
  }
}
Person.prototype.hello = function(param) {
  console.log('hello ' + this.name)
}
let xm = new Person('小明', 12, '男')
console.log(xm) // Person {name: "小明", age: 12, sex: "男", say: ƒ}
xm.say() // my name is 小明
xm.hello() // hello 小明
```

- es6 使用 Class 实现上述代码

```js
class Person {
  constructor(name, age, sex) {
    this.name = name
    this.age = age
    this.sex = sex
  }
  say() {
    console.log('say: ' + this.name)
  }
}

let xm = new Person('小明', 12, '男')
// 类的所有方法都定义在类的prototype属性上面。
console.log(xm) // Person { name: '小明', age: 12, sex: '男' }
xm.say() // say: 小明
```

- 类的数据类型就是函数，类本身就指向构造函数。

```js
class Person {}
console.log(typeof Person) // function
console.log(Person === Person.prototype.constructor) // true
```

- **类** 的内部所有定义的方法，都是不可枚举的（non-enumerable）

```js
class Cat {
  constructor() {}
  miao() {}
}

console.log(Object.keys(Cat.prototype)) // []
console.log(Object.getOwnPropertyNames(Cat.prototype)) // [ 'constructor', 'miao' ]
```

## constructor 方法

- constructor()方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor()方法，如果没有显式定义，一个空的 constructor()方法会被默认添加。
- constructor()方法的 this 指向类生成的实例对象。

```js
class p {}
// 等价于
class p {
  constructor() {}
}
```

## 实例属性的新写法

- 实例属性除了定义在 constructor()方法里面的 this 上面，也可以定义在类的最顶层。

```js
class P {
  _name = '丽丽'
}
// 等价于
class P {
  constructor() {
    this._name = '丽丽'
  }
}
let p1 = new P()
console.log(p1) // P { _name: '丽丽' }
```

## this 指向

- 类的方法内部如果含有 this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```js
class Person {
  constructor(name) {
    this.name = name
  }
  say() {
    console.log('Hi ' + this.name)
  }
}
let xm = new Person('小明')
// 单独使用say方法
let { say } = xm
say() // Cannot read property 'name' of undefined
```

- 上面代码中，say()中的 this 默认指向 Person 类的实例对象，但是提取出 say 方法单独使用，this 会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是 undefined），从而导致找不到 name 属性而报错。

### 解决办法

1. 在构造方法中绑定 this

```js
class Person {
  constructor(name) {
    this.name = name
    // 将say函数的 this 指定为 bind() 的第一个参数
    this.say = this.say.bind(this)
  }
  say() {
    console.log('Hi ' + this.name)
  }
}
let xm = new Person('小明')
let { say } = xm
say() // Hi 小明
```

2. 使用箭头函数。

```js
class Person {
  constructor(name) {
    this.name = name
  }
  // 箭头函数内部的 this 总是指向定义时所在的对象。
  say = () => {
    console.log('Hi ' + this.name)
  }
}
let xm = new Person('小明')
let { say } = xm
say() // Hi 小明
```

## 静态方法

- 类 相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上 **static** 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```js
class Person {
  static sayHi() {
    console.log('Hi')
  }
}
let p = new Person()
Person.sayHi() // Hi
p.sayHi() // TypeError: p.sayHi is not a function
```

- 如果静态方法包含 this 关键字，这个 this 指的是类，而不是实例。

```js
class Person {
  static sayHi() {
    this.Hi()
  }
  static Hi() {
    console.log('Hi~')
  }
  Hi() {
    console.log('hahhh')
  }
}
let p = new Person()
Person.sayHi() // Hi~
p.Hi() // hahhh
```

- 上面代码中，静态方法 sayHi 调用了 this.Hi，这里的 this 指向的是 Person 类，等同于调用了 Person.Hi()。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。

- 父类的静态方法，可以被子类继承。

```js
class Person {
  static sayHi() {
    console.log('Hi~')
  }
}
class Star extends Person {}
Star.sayHi() // Hi~
```

- 静态方法也是可以从 **super** 对象上调用的。

```js
class Person {
  static sayHi() {
    console.log('Hi~')
  }
}
class Star extends Person {
  static Hi() {
    super.sayHi()
  }
}
Star.Hi() // Hi~
```

## 静态属性

- 静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性。

```js
class Person {
  static id = 1
}
console.log(Person.id) // 1
```

## 类的继承

- Class 可以通过 extends 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```js
// 鸟类
class Bird {
  constructor(cb, leg) {
    this.cb = cb
    this.leg = leg
  }
  fly() {
    console.log('我会飞')
  }
}
// 麻雀类
class Maque extends Bird {
  constructor(cb, leg, color, name) {
    super(cb, leg)
    this.color = color
    this.name = name
  }
}
let lily = new Maque('两只翅膀', '两条腿', 'black', 'lily')
console.log(lily)
lily.fly()
```

- 子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。
- 因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象。

## Object.getPrototypeOf()

- Object.getPrototypeOf 方法可以用来从子类上获取父类。
- 因此，可以使用这个方法判断，一个类是否继承了另一个类。

```js
class Bird {}
class Maque extends Bird {}
console.log(Object.getPrototypeOf(Maque) === Bird) // true
```
