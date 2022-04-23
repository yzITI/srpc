const srpc = require('./node-srpc.js')

srpc._()

srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
