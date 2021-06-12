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
console.log(lily);
lily.fly()
console.log(Object.getPrototypeOf(Maque) === Bird)