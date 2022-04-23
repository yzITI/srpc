const jrpc = require('./jrpc.js')

jrpc._()

jrpc.test = () => 'Hello, world!'
jrpc.add = (x, y) => x + y
