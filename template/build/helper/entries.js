const fs = require('fs')
const path = require('path')
const globby = require('globby')
const slash = require('slash')
const ls = require('./ls')

const ENTRIES_PATH = slash(path.resolve(__dirname, '../../src/entries'));

module.exports = function (result = {}/* Object|Array */, ignoreLeadingChar = '_'/* ignore " custom char" leading path */) {
  // find all js and html files in [entries] directory as entry
  let arr = globby.sync([
    `${ENTRIES_PATH}/**/*.{js,html}`,
    `!**/${ignoreLeadingChar}*`
  ])
  // Normalize entry path in posix style
  .map(function (entry) {
    return slash(path.normalize(entry))
      .replace(`${ENTRIES_PATH}`, '')
      .replace(/\.(js|html)$/, '')
      .substr(1)
  })
  // filter duplicate entry with js and html files
  .filter(function (entry, index, self) {
    return self.indexOf(entry) === index
  })
  // return result in Array[entry] type
  if (Array.isArray(result)) {
    return result.concat(arr)
  }
  // return result in Object{entry:file} type
  return arr.reduce((result, entry) => {
    let filePath = path.join(ENTRIES_PATH, `${entry}.js`)
    if (typeof result[entry] === 'undefined') {
      // check entry js file dose not exist and create it
      if (!fs.existsSync(filePath)) {
        fs.closeSync(fs.openSync(filePath, 'wx'))
      }
      result[entry] = filePath
    }
    return result
  }, result)
}
