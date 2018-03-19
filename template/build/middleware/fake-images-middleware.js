module.exports = function(route) {

  //
  // [ express middleware ]
  // Generate a /fake/images route for testing images source
  //
  // images service:
  //  - PLACEMAT(https://placem.at)
  //      Places and things courtesy of Unsplash.
  //      People from Greg Peverill-Conti's 1000 faces project. Licensed under Creative Commons BY-NC-SA 2.0.
  //      Powered by imgix, which totally solves images on the web. No, seriously.
  //      Placemat is a Paul Straw jam. You can check out the source on GitHub.
  //  - PICSUM(https://picsum.photos)
  //      Created by David Marby & Nijiko Yonskai
  //      Having trouble? Poke @DMarby on Twitter
  //      Images from unsplash
  // --------------------------------------------------------------------------------
  // usage:
  //     /fake/images/{width}/{height}/{any|people|places|things}/{fixed-id}
  // e.g.
  //     /fake/images/320/480/
  //     /fake/images/720-960/480/
  //     /fake/images/720-960/480-540/
  //     /fake/images/720-960/480-540/things
  //     /fake/images/720-960/480-540/things/13
  //

  const url = require('url')
  const request = require('request')

  const
      PROTOCOL = 'http:',
      VENDORS = {
        placemat: 'placem.at',
        placeimg: 'placeimg.com',
        picsum: 'picsum.photos'
      },
      CATEGORY = ['people', 'places', 'things'],
      MIN_WIDTH = 100,
      MIN_HEIGHT = 100,
      MAX_WIDTH = 1000,
      MAX_HEIGHT = 1000,
      FIXED_ID = 0,
      RANDOM = 0

  const rand = function (minNum, MaxNum) {
      let len = arguments.length
      if (len === 0) {
          return Math.random()
      } else if (len > 1) {
          return Math.round(Math.random() * (MaxNum - minNum)) + minNum
      }
      return Math.round(Math.random() * minNum)
  }

  const onError = function (err) {
    console.log(err)
  }

  return function(req, res, next) {
      var location, params, category, query, fixedId,
          widthInfo, heightInfo, minWidth, minHeight, maxWidth, maxHeight,
          vendorList, vendorName, source
      location = url.parse(req.url)
      if (!/^\/fake\/images(\/.*)?$/.test(location.pathname)) {
          next()
          return
      }
      params = location.pathname.replace(/^\/fake\/images\/?/, '').split('/')
      widthInfo = params[0] || null
      heightInfo = params[1] || null
      category = !params[2] || params[2] === 'any' || CATEGORY.indexOf(params[2]) === -1 ? CATEGORY[Math.floor(Math.random() * CATEGORY.length)] : params[2]
      fixedId = params[3] || 0
      if (!widthInfo) {
          width = rand(MIN_WIDTH, MAX_WIDTH)
      } else {
          widthInfo = widthInfo.split('-')
          if (widthInfo.length < 2) {
              width = Number(widthInfo[0]) || rand(MIN_WIDTH, MAX_WIDTH)
          } else {
              minWidth = Number(widthInfo[0]) || MIN_WIDTH
              maxWidth = Number(widthInfo[1]) || MIN_WIDTH
              width = rand(minWidth, maxWidth)
          }
      }
      if (!heightInfo) {
          height = rand(MIN_HEIGHT, MAX_HEIGHT)
      } else {
          heightInfo = heightInfo.split('-')
          if (heightInfo.length < 2) {
              height = Number(heightInfo[0]) || rand(MIN_HEIGHT, MAX_HEIGHT)
          } else {
              minHeight = Number(heightInfo[0]) || MIN_HEIGHT
              maxHeight = Number(heightInfo[1]) || MIN_HEIGHT
              height = rand(minHeight, maxHeight)
          }
      }
      vendorList = Object.keys(VENDORS)
      vendorName = vendorList[rand(0, vendorList.length - 1)]
      switch (vendorName) {
        case 'placemat':
          source = `${PROTOCOL}//${VENDORS[vendorName]}/${category}?w=${width}&h=${height}&random=${fixedId}`
          break
        case 'placeimg':
          switch (category) {
            case 'people':
              category = 'people'
              break
            case 'places':
              category = 'nature'
              break
            case 'things':
              category = 'tech'
              break
            default:
              category = 'any'
              break
          }
          source = `${PROTOCOL}//${VENDORS[vendorName]}/${width}/${height}/${category}?t=${fixedId || Date.now().toString()}`
          break
        case 'picsum':
          source = `${PROTOCOL}//${VENDORS[vendorName]}/${width}/${height}${!fixedId ? '?random' : ''}`
          break
        default:
          source = `${PROTOCOL}//via.placeholder.com/${width}x${height}/`
          return
      }
      source && request.get(`${source}`).on('error', onError).pipe(res)
  }
}
