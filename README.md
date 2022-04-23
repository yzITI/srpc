# SRPC

A super simple RPC.

## http-server

```js
const srpc = require('./srpc.js')

// special init function _
srpc._() // listen on port 2333 by default

// the following methods are exported
srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
```

## http-client

```js
import srpc from './srpc.js'

// initialize with endpoint
srpc._('http://localhost:2333/')

// just call the functions!
srpc.test() // Promise -> 'Hello, world!'
srpc.add(1, 2) // Promise -> 3
```