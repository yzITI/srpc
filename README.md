# SRPC

A super simple RPC, connect client and server with the least possible code!

**NO dependency, NO schema, NO config, just define functions and CALL!**

```js
// On Server
const srpc = require('./server-node.js')
srpc() // start server
srpc.add = (x, y) => x + y

// -------------------------------------

// On Client
import srpc from './client-es.js'
srpc('http://localhost:11111/') // server endpoint
console.log(await srpc.add(1, 2)) // 3
```

## Server

export functions to be called by clients

### Nodejs

```js
const srpc = require('./server-node.js')

srpc() // listen on port 11111 by default

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
// function can be nested!
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)
```

### Aliyun Function Compute

```js
const srpc = require('./server-fc.js')

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)

// entrance
exports.handler = srpc()
```

## Client

call functions on server and get the return value

[Online Client Demo/Debug](https://yziti.github.io/srpc/)

### Browser

```js
import srpc from './client-es.js'

// initialize with endpoint
srpc('http://localhost:11111/')

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

### Nodejs

```js
const srpc = require('./client-node.js')

// initialize with endpoint
srpc('https://matrix.yzzx.org/srpc')

srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

## Model

```js
Request {
  N: 'function.name',
  A: [1, 2, 3] // args
}
Context {
  N, A, R,
  IP: String, // request IP
  F: Function
}
Response {
  R: {} // return
}
```

## Server Config

```js
// node-srpc
srpc(hooks = {
  before: Context => {}, // abort if assign Context.R
  after: Context => {}
}, port = 11111)

// fc-srpc
srpc(hooks = {
  before: Context => {}, // abort if assign Context.R
  after: Context => {}
})
```
