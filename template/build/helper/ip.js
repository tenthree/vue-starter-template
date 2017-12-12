const ifaces = require('os').networkInterfaces()

module.exports = (function () {
  let index, len, group, item, id
  index = 0
  for (id in ifaces) {
    group = ifaces[id]
    len = group.length
    index = 0
    while (index < len) {
      item = group[index]
      if (item.family === 'IPv4' && !item.internal && item.address !== '127.0.0.1') {
        return item.address
      }
      index++
    }
  }
  return '127.0.0.1'
})()
