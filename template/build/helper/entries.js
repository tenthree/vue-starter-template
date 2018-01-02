const path = require('path')
const ls = require('./ls')

const ENTRIES_PATH = path.resolve(__dirname, '../../src/entries');

module.exports = function (result = {}/* Object|Array */, ignoreChar = '_'/* ignore " custom char" leading path */) {
  let arr = ls(ENTRIES_PATH, 'directory')
    .filter(entry => entry.substr(0, 1) !== ignoreChar)
  if (Array.isArray(result)) {
    return result.concat(arr)
  }
  return arr.reduce((result, entry) => {
    result[entry] = path.join(ENTRIES_PATH, `${entry}/main.js`)
    return result
  }, result)
}
