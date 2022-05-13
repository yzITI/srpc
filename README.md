# SRPC

A super simple RPC.

## Server

### Nodejs

```js
const srpc = require('./server.node.js')

srpc() // listen on port 2333 by default

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
// function can be nested!
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)
```

### Aliyun Function Compute

```js
const srpc = require('./server.fc.js')

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)

// entrance
exports.handler = srpc()
```

## Client

### Browser

```js
import srpc from './client.es.js'

// initialize with endpoint
srpc('http://localhost:2333/')

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

### Nodejs

```js
const srpc = require('./client.node.js')

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
  N, A, R, F: Function
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
}, port = 2333)

// fc-srpc
srpc(hooks = {
  before: Context => {}, // abort if assign Context.R
  after: Context => {}
})
```
