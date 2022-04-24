# SRPC

A super simple RPC.

## http-server

### node-srpc

for Nodejs

```js
const srpc = require('./node-srpc.js')

srpc() // listen on port 2333 by default

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
// function can be nested!
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)
```

### fc-srpc

for Aliyun Function Compute

```js
const srpc = require('./fc-srpc.js')

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)

// entrance function
exports.handler = srpc
```

## http-client

```js
import srpc from './srpc.js'

// initialize with endpoint
srpc('http://localhost:2333/')

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.sqrt(2) // Promise -> 1.4142135623730951
```