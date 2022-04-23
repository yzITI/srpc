let url = '/'

export default {
  init: (endpoint = '/') => url = endpoint,
  _: new Proxy({}, {
    get: (target, prop) => ((...args) => fetch(url, {
      method: 'POST', mode: 'cors', cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _: prop, ':': args })
    }).then(r => r.json()).then(r => r[':']))
  })
}