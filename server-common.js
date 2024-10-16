// CommonJS SRPC Server

const http = require('http')

const functions = {}
let _hooks = {}

async function handle (raw, IP) {
  let body = {}, F = functions
  try { body = JSON.parse(raw) }
  catch { return ['Body Error', 400] }
  if (!(body.N instanceof Array) || !(body.A instanceof Array)) return ['Arguments Error', 400]
  try { // find function
    for (const n of body.N) {
      if (!F.hasOwnProperty(n)) throw 1
      F = F[n]
    }
    if (typeof F !== 'function') throw 1
  } catch { return ['Function Not Found', 404] }
  try { // call function
    const ctx = { N: body.N, A: body.A || [], IP, F }
    if (_hooks.before) await _hooks.before(ctx)
    if (typeof ctx.R !== 'undefined') return [JSON.stringify({ R: ctx.R }), 200]
    ctx.R = await F(...ctx.A)
    if (_hooks.after) await _hooks.after(ctx)
    return [JSON.stringify({ R: ctx.R }), 200]
  } catch (e) { return ['Internal Error', 500] }
}

const cors = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST'
}

function listener (req, resp) {
  if (req.method === 'OPTIONS') return resp.writeHead(204, cors).end()
  if (req.method !== 'POST') return resp.writeHead(400).end('Method Error')
  let raw = ''
  req.on('data', chunk => { raw += chunk })
  req.on('end', async () => {
    const [body, status] = await handle(raw, req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket.address().address)
    resp.writeHead(status, {
      ...cors,
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': status === 200 ? 'application/json' : 'text/plain'
    }).end(body)
  })
}

module.exports = new Proxy((hooks = {}, port = 11111) => {
  _hooks = hooks
  const server = http.createServer(listener)
  return new Promise(r => { server.listen(port, r) })
}, {
  get: (target, prop) => functions[prop],
  set: (target, prop, value) => functions[prop] = value
})
