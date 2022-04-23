const getJSONBody = require('util').promisify(require('body/json'))

const srpc = {}

async function handle (req) {
  if (req.method !== 'POST') return ['Method Error', 400]
  let body = {}
  try { body = await getJSONBody(req) }
  catch { return ['Body Error', 400] }
  if (body._ === '_' || typeof srpc[body._] !== 'function') return ['Function Not Found', 404]
  if (body[':'] && !(body[':'] instanceof Array)) return ['Arguments Error', 400]
  try { // call function
    const res = await srpc[body._](...(body[':'] || []))
    return [JSON.stringify({ ':': res }), 200]
  } catch (e) { return ['Internal Error', 500] }
}

srpc._ = async (req, resp) => {
  const [body, status] = await handle(req)
  resp.setStatusCode(status)
  resp.setHeader('content-type', status === 200 ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8')
  resp.send(body)
}

module.exports = srpc