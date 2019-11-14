const harmon = require('harmon')
const { PROXY_NAME, PROXY_TARGET_REGEXP } = require('./constant')
const { handleCookie } = require('./helpers')

exports.hasUrlParam = (req, res, next) => {
  if (!req.url.includes(PROXY_NAME)) {
    return next()
  }

  const match = req.url.match(PROXY_TARGET_REGEXP)
  if (match) {
    const [target] = match
    req.proxyTarget = target
  }
  next()
}

exports.hasReferer = (req, res, next) => {
  if (!req.headers.referer || !req.headers.referer.includes(PROXY_NAME)) {
    return next()
  }

  const match = req.headers.referer.match(PROXY_TARGET_REGEXP)
  if (match) {
    const [referer] = match
    req.proxy_name = referer
  }
  next()
}

exports.hasCookie = (req, res, next) => {
  if (!req.headers.cookie) {
    return next()
  }

  const { [PROXY_NAME]: cookie } = handleCookie(req.headers.cookie)

  if (cookie) {
    req.proxy_name = cookie
  }
  next()
}

exports.insertCookie = harmon([], [{
  query: 'head',
  func(node, req) {
    node.createWriteStream().end(`
      <script>document.cookie='${PROXY_NAME}=${req.proxy_name}'</script>
    `)
  }
}], true)

exports.insertScript = harmon([], [{
  query: 'head',
  func(node) {
    node.createWriteStream().end(`
      <script src="/event.js"></script>
    `)
  }
}], true)
