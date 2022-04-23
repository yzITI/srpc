# JRPC

A super simple RPC.

## http-server

```js
const jrpc = require('./jrpc.js')

// special init function _
jrpc._() // listen on port 2333 by default

// the following methods are exported
jrpc.test = () => 'Hello, world!'
jrpc.add = (x, y) => x + y
```

## http-client

```js
import jrpc from './jrpc.js'

// initialize with endpoint
jrpc._('http://localhost:2333/')

// just call the functions!
jrpc.test() // Promise -> 'Hello, world!'
jrpc.add(1, 2) // Promise -> 3
```