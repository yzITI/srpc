const jrpc = require('./jrpc.js')

jrpc.init()

jrpc._.test = () => 'Hello, world!'
jrpc._.add = (x, y) => x + y
