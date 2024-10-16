# SRPC

A super simple RPC, connect client and server with the least possible code!

**NO dependency, NO schema, NO config, just define functions and CALL!**

```js
// On Server
import srpc from './server-es.js'
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
import srpc from './server-es.js'
// const srpc = require('./server-common.js')

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

exports.handler = srpc() // entrance
```

## Client

call functions on server and get the return value

[Online Client Demo/Debug](https://yziti.github.io/srpc/)

### Browser Global

Add script to `<head>`

```html
<script src="https://cdn.jsdelivr.net/gh/yzITI/srpc@main/client.js"></script>
```

**OR** copy `client-es.js` into your ESM project:

```js
import srpc from './client-es.js'
```

```js
// initialize with endpoint
srpc('http://localhost:11111/')

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

### Nodejs

```js
import srpc from './client-es.js'
// const srpc = require('./client-common.js')

// initialize with endpoint
srpc('http://localhost:11111/')

srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

### Python

```python
from .client import srpc

srpc('http://localhost:11111/')

srpc.test() # 'Hello, world!'
srpc.add(1, 2) # 3
srpc.calc.sqrt(2) # 1.4142135623730951
```

## Protocol Model

The following request and response model are used with http `POST` method and `'Content-Type': 'application/json'`.

```js
Request {
  N: 'function.name', // function name
  A: [1, 2, 3] // args in order
}
Response {
  R: {} // return value
}
// Context data model used in hooks
Context {
  N, A, R,
  IP: String, // request IP
  F: Function
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
