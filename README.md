# SRPC

A super simple RPC, connect client and server with the least possible code!

**NO dependency, NO schema, NO config, just define functions and CALL!**

```js
// On Server
import srpc from './server-es.js'
srpc.add = (x, y) => x + y
srpc() // start server

// On Client
import srpc from './client-es.js'
srpc('http://localhost:11111/') // server endpoint
console.log(await srpc.add(1, 2)) // 3
```

## Server

Export functions to be called by clients

### Nodejs Server

```js
import srpc from './server-es.js'
// const srpc = require('./server-common.js')

srpc() // listen on port 11111 by default

// following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {} // function can be nested!
srpc.calc.sqrt = x => Math.sqrt(x)
```

### Aliyun Function Compute Server

```js
const srpc = require('./server-fc.js')

// following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)

exports.handler = srpc() // entrance
```

### Python Server

```python
from server import srpc

srpc() # listen on port 11111 by default

# Python dict uses []
srpc["test"] = lambda: "Hello, world!"
def add(x,  y):
    return x + y
srpc["add"] = add
import math
srpc["calc"] = { "sqrt": math.sqrt }
```

## Client

call functions on server and get the return value

[Online Client Demo/Debug](https://yziti.github.io/srpc/)

### Browser Client

Add script to `<head>`

```html
<script src="https://cdn.jsdelivr.net/gh/yzITI/srpc@main/client.js"></script>
```

**OR** copy `client-es.js` into your ESM project:

```js
import srpc from './client-es.js'
```

```js
srpc('http://localhost:11111/') // initialize with endpoint

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

### Nodejs Client

```js
import srpc from './client-es.js'
// const srpc = require('./client-common.js')

srpc('http://localhost:11111/') // initialize with endpoint

srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```

### Python Client

```python
from client import srpc

srpc('http://localhost:11111/')

srpc.test() # 'Hello, world!'
srpc.add(1, 2) # 3
srpc.calc.sqrt(2) # 1.4142135623730951
```

## Advanced

For development and customization.

### Protocol Model

The following request and response model are used with http `POST` method and `'Content-Type': 'application/json'`.

```js
Request {
  N: ['nested', 'f'], // function name
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

### Server Options

```js
// Nodejs Server
srpc(hooks = {
  before: Context => {}, // abort if assign Context.R
  after: Context => {}
}, port = 11111)

// Aliyun Function Compute Server
srpc(hooks = {
  before: Context => {}, // abort if assign Context.R
  after: Context => {}
})
```

```python
srpc(hooks={
  "before": Function(Context),
  "after": Function(Context)
}, port=11111)
```
