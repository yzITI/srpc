const getJSONBody = require('util').promisify(require('body/json'))

const functions = {}

async function handle (req) {
  if (req.method !== 'POST') return ['Method Error', 400]
  let body = {}, f = functions
  try { body = await getJSONBody(req) }
  catch { return ['Body Error', 400] }
  if (body[':'] && !(body[':'] instanceof Array)) return ['Arguments Error', 400]
  try { // find function
    const ns = body._.split('.')
    for (const n of ns) f = f[n]
    if (typeof f !== 'function') throw 1
  } catch { return ['Function Not Found', 404] }
  try { // call function
    const res = await f(...(body[':'] || []))
    return [JSON.stringify({ ':': res }), 200]
  } catch (e) { return ['Internal Error', 500] }
}

module.exports = new Proxy(async (req, resp) => {
  const [body, status] = await handle(req)
  resp.setStatusCode(status)
  resp.setHeader('content-type', status === 200 ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8')
  resp.send(body)
}, {
  get: (target, prop) => functions[prop],
  set: (target, prop, value) => functions[prop] = value
})
