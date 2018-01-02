const fs = require('fs')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const globby = require('globby')
const archiver = require('archiver')
const clear = require('clear')
const now = require('./helper/now')()
const pkg = require('../package.json')

const BACKUP_VERSION = `${now.year.substr(1)}.${now.month}${now.date}.${now.hour}${now.minute}.${now.second}s`;

const BACKUP_FILE = `/backup/${pkg.name}.${BACKUP_VERSION}.zip`

const PROJECT_ROOT = path.resolve(__dirname, '../')

const patterns = [
  '**',
  '.*{rc,ignore,js,json,config}',
  '!**/_*/**',
  '!dist/**',
  '!backup/**',
  '!node_modules/**',
  '!bower_components/**'
]

const spinner = ora()
spinner.start('Backup processing...')

// resolve pattern format in absolute path
pattern = patterns.map(pattern => {
  if (pattern.indexOf('!') !== 0) {
    return path.join(PROJECT_ROOT, pattern)
  }
  return `!${path.join(PROJECT_ROOT, pattern.substr(1))}`
})

// make sure path is exist
mkdirp.sync(path.dirname(path.join(PROJECT_ROOT, BACKUP_FILE)))

// create output stream
const output = fs.createWriteStream(path.join(PROJECT_ROOT, BACKUP_FILE))

// create archiver instance
const archive = archiver('zip', {
  zlib: {
    level: 9
  }
})

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function () {
  spinner.stop()
  clear()
  console.log(chalk.bgBlue(` ${BACKUP_FILE} `) + chalk.bgMagenta(` ${(archive.pointer() / 1024).toFixed(2)} KB `))
  console.log(chalk.magenta('Backup completed.'))
})

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function () {
  // console.log('Data has been drained')
})

// archiver entry event
archive.on('entry', function (file) {
  // console.log(chalk.magenta(file.name))
  spinner.succeed(file.name)
})

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
    spinner.warn(err.message)
  } else {
    // throw error
    throw err
  }
})

// good practice to catch this error explicitly
archive.on('error', function (err) {
  spinner.warn(err.message)
  spinner.stop()
  throw err
})

archive.pipe(output)

// Read project file patterns by globby
globby(patterns)
  .then(files => {
    files.forEach(file => {
      archive.file(file, {
        cwd: PROJECT_ROOT,
        prefix: pkg.name
      })
    })
    archive.finalize()
  })
  .catch(err => {
    spinner.warn(err)
    spinner.stop()
  })
