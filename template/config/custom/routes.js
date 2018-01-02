'use strict'

// Middleware to proxy requests through a specified url page or local html file,
// useful for Single Page Applications that utilise the HTML5 History API.
// usage:
//     {
//       from: '{ Regular Expression }'
//       to: '{ rewrite url | local file path }'
//     }

module.exports = [
  // e.g. 404 page
  // url /404
  {
    from: /^\/404(\/?(\?.*)?)$/,
    to: './build/html/404.html'
  }
]