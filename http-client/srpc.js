let url = '/'

const getFunction = name => ((...args) => fetch(url, {
  method: 'POST', mode: 'cors', cache: 'no-cache',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ _: name, ':': args })
}).then(async r => {
  if (r.status === 200) return (await r.json())[':']
  else throw (await r.text())
}))

const proxyGet = (target, prop) => {
  const key = target.key
  // init function
  if (!key && prop === '_') return (endpoint = '/') => url = endpoint
  // rpc call function
  const newKey = key ? key + '.' + prop : prop, f = getFunction(newKey)
  f.key = newKey
  return new Proxy(f, { get: proxyGet })
}

export default new Proxy({}, { get: proxyGet })