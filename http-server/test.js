const srpc = require('./node-srpc.js')

srpc._()

srpc.test = () => 'Hello, world!'
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)
