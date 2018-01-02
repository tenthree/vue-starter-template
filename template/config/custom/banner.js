'use strict'

const rev = require('git-rev-sync')
const now = require('../../build/helper/now')()
const pkg = require('../../package.json')

// --------------------------------------------------
// git information
// --------------------------------------------------
let branch, commit
try {
  branch = rev.branch(),
  commit = rev.short();
} catch (err) {
  branch = '[!] Not a git repository';
  commit = '[!] Not a git repository';
}

// [TIP] cssnano options: "discardComments"
// Removes comments in and around rules, selectors & declarations.
// Note that any special comments marked with ! are kept by default.
module.exports = `/*!\n` +
    `@build with webpack\n` +
    `------------------------------\n` +
    `project : ${pkg.name}\n` +
    `author  : ${pkg.author}\n` +
    `branch  : ${branch}\n` +
    `commit  : ${commit}\n` +
    `file:   : [file]\n` +
    `hash    : [hash]\n` +
    `chunk   : [chunkhash]\n` +
    `update  : ${now.text}\n` +
    `------------------------------\n` +
    `*/\n`
