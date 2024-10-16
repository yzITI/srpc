const srpc = require('./server-common.js')

srpc({
  before: console.log,
  after: console.log
})

srpc.test = () => 'Hello, world!'
srpc.add = (x, y) => x + y
srpc.calc = {}
srpc.calc.sqrt = x => Math.sqrt(x)
