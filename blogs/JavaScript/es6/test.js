function demo3() {
    console.log(this)
    return () => {
        console.log(this)
    }
}
const fn = demo3()
fn() // window window
const fn1 = demo3.call({
    name: 'jack'
}) // { name: 'jack' } { name: 'jack' }
fn1()