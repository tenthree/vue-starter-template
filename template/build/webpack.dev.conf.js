'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const fs = require('fs')
const chalk = require('chalk')
const ngrok = require('ngrok')
const qrcode = require('qrcode-terminal')
const entries = require('./helper/entries')
const routes = require('../config/custom/routes')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: false,
    hot: true,
    contentBase: path.resolve(__dirname, '../static'),
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    disableHostCheck: true,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // added custom express middlewares
    before (app) {
      app.use(require('./middleware/router-middleware')(routes))
      app.use(require('./middleware/fake-images-middleware')())
    },
    after (app) {
      app.use(require('./middleware/router-404-middleware')(path.resolve(__dirname, './html/404.html')))
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    ...(function () {
      let defaultHtmlFile = path.resolve(__dirname, './html/default.html')
      return entries([])
        .reduce((pages, entry) => {
          let sourceHtmlFile = path.resolve(__dirname, `../src/entries/${entry}.html`)
          pages.push(new HtmlWebpackPlugin({
            filename: `${entry}.html`,
            template: !fs.existsSync(sourceHtmlFile) ? defaultHtmlFile : sourceHtmlFile,
            chunks: [entry],
            inject: true
          }))
          return pages
        }, [])
    })()
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      // ------------------------------------------------------------------------------------------
      // ngrok
      // https://github.com/bubenshchykov/ngrok
      // ------------------------------------------------------------------------------------------
      // ngrok.connect({
      //     proto: 'http', // http|tcp|tls
      //     addr: 8080, // port or network address
      //     auth: 'user:pwd', // http basic authentication for tunnel
      //     subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io
      //     authtoken: '12345', // your authtoken from ngrok.com
      //     region: 'us' // one of ngrok regions (us, eu, au, ap), defaults to us,
      //     configPath: '~/git/project/ngrok.yml' // custom path for ngrok config file
      // }, function (err, url) {})
      // ------------------------------------------------------------------------------------------
      let tunnel = require('../config/custom/ngrok')
      if (!tunnel || !tunnel.enable) {
        // Add FriendlyErrorsPlugin
        devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          },
          onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
        }))

        resolve(devWebpackConfig)
        return
      }
      tunnel.proto = 'http'
      tunnel.addr = `${config.dev.host}:${port}`
      if (tunnel.user && tunnel.pass) {
          tunnel.auth = `${tunnel.user}:${tunnel.pass}`
          delete tunnel.user
          delete tunnel.pass
      }
      ngrok.connect(tunnel, function (err, url) {
        if (err) {
          console.log(chalk.bgRed('ngrok connection error'))
          console.log(chalk.red(err))
          resolve(devWebpackConfig)
          return
        }
        // replace ssl protocol, hot-reload sockjs will fetch js file by ssl with wrong port
        url = url.replace('https://', 'http://')
        qrcode.generate(`${url}`, { small: true }, function (code) {
            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
              compilationSuccessInfo: {
                messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                notes: [`${chalk.bgMagenta('ngrok generated url')} ${chalk.yellow(url) + chalk.white('->') + chalk.cyan(tunnel.addr) + '\n' + code}`]
              },
              onErrors: config.dev.notifyOnErrors
              ? utils.createNotifierCallback()
              : undefined
            }))

            resolve(devWebpackConfig)
        })
      })
    }
  })
})
