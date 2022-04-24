const srpc = require('./node-srpc.js')

srpc._()

srpc.test = () => 'Hello, world!'
srpc.calc = {}
srpc.calc.add = (x, y) => x + y
