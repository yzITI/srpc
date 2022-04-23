# JRPC

A super simple RPC.

## http-server

```js
const jrpc = require('./jrpc.js')

jrpc.init() // listen on port 2333 by default

// the following methods are exported
jrpc._.test = () => 'Hello, world!'
jrpc._.add = (x, y) => x + y
```

## http-client

```js
import jrpc from './jrpc.js'

// initialize with endpoint
jrpc.init('http://localhost:2333/')

// just call the functions!
jrpc._.test() // Promise -> 'Hello, world!'
jrpc._.add(1, 2) // Promise -> 3
```