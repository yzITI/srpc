let url = '/'

export default new Proxy({}, {
  get: (target, prop) => {
    // init function
    if (prop === '_') return (endpoint = '/') => url = endpoint
    // rpc call function
    return (...args) => fetch(url, {
      method: 'POST', mode: 'cors', cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _: prop, ':': args })
    }).then(r => r.json()).then(r => r[':'])
  }
})