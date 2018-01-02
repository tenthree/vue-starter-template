const fs = require('fs')
const path = require('path')

module.exports = function (dir, onlyType /* directory|file */ ) {
  let filter, list, isType
  filter = !onlyType ? -1 : ['file', 'directory'].indexOf(onlyType)
  list = fs.readdirSync(dir)
  if (filter < 0) {
    return list
  }
  isType = 'is' + onlyType.charAt(0).toUpperCase() + onlyType.substr(1)
  return list.filter(function (file) {
    return fs.statSync(path.join(dir, file))[isType]()
  })
}
