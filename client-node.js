const http = require('http'), https = require('https')

let url = '/', request = () => {}

const getFunction = name => ((...args) => new Promise((r, rej) => {
  const req = request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', () => {
      if (res.statusCode === 200) r(JSON.parse(data).R)
      else rej(data)
    })
  })
  req.write(JSON.stringify({ N: name, A: args }))
  req.on('error', rej)
  req.end()
}))

const proxyGet = (target, prop) => {
  const key = target.key, newKey = key ? key + '.' + prop : prop, f = getFunction(newKey)
  f.key = newKey
  return new Proxy(f, { get: proxyGet })
}

module.exports = new Proxy((endpoint = '/') => {
  url = endpoint
  if (url.indexOf('https') === 0) request = https.request
  else request = http.request
}, { get: proxyGet })