const http = require('http')

const jrpc = {}

async function handle (raw, resp) {
  let body = {}
  try { body = JSON.parse(raw) }
  catch { return ['Body Error', 400] }
  if (body._ === '_' || typeof jrpc[body._] !== 'function') return ['Function Not Found', 404]
  if (body[':'] && !(body[':'] instanceof Array)) return ['Arguments Error', 400]
  try { // call function
    const res = await jrpc[body._](...(body[':'] || []))
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
    const [body, status] = await handle(raw, resp)
    resp.writeHead(status, {
      ...cors,
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': status === 200 ? 'application/json' : 'text/plain'
    }).end(body)
  })
}

jrpc._ = (port = 2333) => {
  const server = http.createServer(listener)
  return new Promise(r => { server.listen(port, r) })
}

module.exports = jrpc
