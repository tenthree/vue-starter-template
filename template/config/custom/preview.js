'use strict'

const compressMiddleware = require('compression')
const httpProxyMiddleware = require('http-proxy-middleware')
const routerMiddleware = require('../../build/middleware/router-middleware')
const router404Middleware = require('../../build/middleware/router-404-middleware')
const proxy = require('./proxy')
const routes = require('./routes')
const config = require('../')

// lite-server
// https://github.com/johnpapa/lite-server
// ------------------------------------------------------------------------------------------
// Lightweight development only node server that serves a web app,
// opens it in the browser, refreshes when html or javascript change,
// injects CSS changes using sockets, and has a fallback page when a route is not found.
// ------------------------------------------------------------------------------------------

module.exports = function (browsersync) {
  // custom middleware collection
  let customMiddlewares = [
    compressMiddleware(), // added gzip compressor
    routerMiddleware(routes) //added custom router
  ]
  // added multiple http-proxy-middleware settings
  let proxyBeginIndex = Object.keys(customMiddlewares)
  for (let pattern in proxy) {
    customMiddlewares.push(httpProxyMiddleware(pattern, proxy[pattern]))
  }
  // browsersync init event
  browsersync.emitter.on('init', function () {
    let instance = browsersync.instance
    // add 404 custom template
    instance.addMiddleware('*', router404Middleware('./build/html/404.html'))
  })

  return {
    host: config.dev.host,
    port: config.dev.port,
    files: ['./dist/**/*'],
    server: {
      baseDir: './dist',
      middleware: customMiddlewares
    },
    ghostMode: false,
    logLevel: 'warn',
    notify: false
  }
}
