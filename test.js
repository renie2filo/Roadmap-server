const x = 327
const y = 100

let times = parseInt(x / y)
const reminder = x % y

console.log(times)

reminder > 0 ? times += 1 : times

console.log(times)

for (let index = 0; index < times; index++) {
    console.log(`fetch startat: ${index * 100}`)
}