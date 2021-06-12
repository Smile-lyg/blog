async function demo() {
    let a = await Promise.resolve(1)
    return a
}
demo()
    .then((v) => console.log(v)) // undefind
    .catch((e) => console.log(e))