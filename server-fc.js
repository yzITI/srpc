// Aliyun Function Compute SRPC Server

const getJSONBody = require('util').promisify(require('body/json'))

const functions = {}
let _hooks = {}

async function handle (req) {
  if (req.method !== 'POST') return ['Method Error', 400]
  let body = {}, F = functions
  try { body = await getJSONBody(req) }
  catch { return ['Body Error', 400] }
  if (body.A && !(body.A instanceof Array)) return ['Arguments Error', 400]
  try { // find function
    const ns = body.N.split('.')
    for (const n of ns) F = F[n]
    if (typeof F !== 'function') throw 1
  } catch { return ['Function Not Found', 404] }
  try { // call function
    const ctx = { N: body.N, A: body.A || [], IP: req.clientIP, F }
    if (_hooks.before) await _hooks.before(ctx)
    if (typeof ctx.R !== 'undefined') return [JSON.stringify({ R: ctx.R }), 200]
    ctx.R = await F(...ctx.A)
    if (_hooks.after) await _hooks.after(ctx)
    return [JSON.stringify({ R: ctx.R }), 200]
  } catch (e) { return ['Internal Error', 500] }
}

async function listener (req, resp) {
  const [body, status] = await handle(req)
  resp.setStatusCode(status)
  resp.setHeader('content-type', status === 200 ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8')
  resp.send(body)
}

module.exports = new Proxy((hooks = {}) => {
  _hooks = hooks
  return listener
}, {
  get: (target, prop) => functions[prop],
  set: (target, prop, value) => functions[prop] = value
})
