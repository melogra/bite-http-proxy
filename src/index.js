const httpProxy = require('http-proxy')
const http = require('http')
const express = require('express')
const app = express()

const { PORT } = require('./constant')
const {
  hasUrlParam,
  hasReferer,
  hasCookie,
  insertCookie,
  insertScript
} = require('./middlewares')

app.use(hasUrlParam)
app.use(hasReferer)
app.use(hasCookie)
app.use(insertCookie)
app.use(insertScript)
app.use((req, res, next) => {
  const { proxy_name: name } = req
  if (name && proxyMap[name]) {
    proxyMap[name].web(req, res)
  }
})

http.createServer(app).listen(PORT)
