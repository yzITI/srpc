# SRPC

A super simple RPC.

## http-server

### node-srpc

for Nodejs

```js
const srpc = require('./node-srpc.js')

// special init function _
srpc._() // listen on port 2333 by default

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
// function can be nested!
srpc.calc = {}
srpc.calc.add = (x, y) => x + y
```

### fc-srpc

for Aliyun Function Compute

```js
const srpc = require('./fc-srpc.js')

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {}
srpc.calc.add = (x, y) => x + y

// special handler function
exports.handler = srpc._
```

## http-client

```js
import srpc from './srpc.js'

// initialize with endpoint
srpc._('http://localhost:2333/')

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
srpc.calc.add(2, 3) // Promise -> 5
```