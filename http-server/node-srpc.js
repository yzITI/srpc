const http = require('http')

const functions = {}

async function handle (raw) {
  let body = {}, f = functions
  try { body = JSON.parse(raw) }
  catch { return ['Body Error', 400] }
  if (body[':'] && !(body[':'] instanceof Array)) return ['Arguments Error', 400]
  try { // find function
    if (body._ === '_') throw 1
    const ns = body._.split('.')
    for (const n of ns) f = f[n]
    if (typeof f !== 'function') throw 1
  } catch { return ['Function Not Found', 404] }
  try { // call function
    const res = await f(...(body[':'] || []))
    return [JSON.stringify({ ':': res }), 200]
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
    const [body, status] = await handle(raw)
    resp.writeHead(status, {
      ...cors,
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': status === 200 ? 'application/json' : 'text/plain'
    }).end(body)
  })
}

module.exports = new Proxy((port = 2333) => {
  const server = http.createServer(listener)
  return new Promise(r => { server.listen(port, r) })
}, {
  get: (target, prop) => functions[prop],
  set: (target, prop, value) => functions[prop] = value
})
