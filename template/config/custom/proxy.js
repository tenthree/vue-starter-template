'use strict'

// http-proxy-middleware configuration
// https://github.com/chimurai/http-proxy-middleware

module.exports = {
  // e.g. github
  // source: https://api.github.com/repos/f2etw/jobs/issues
  // proxy: /github/repos/f2etw/jobs/issues
  '/github/': {
    target: 'https://api.github.com',
    changeOrigin: true,
    pathRewrite: { '^/github/': '' }
  }
}
