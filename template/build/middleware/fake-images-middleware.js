module.exports = function(route) {

    //
    // [ express middleware ]
    // Generate a /fake/images route for testing images source
    //
    // images service: PLACEMAT(https://placem.at)
    //     Places and things courtesy of Unsplash.
    //     People from Greg Peverill-Conti's 1000 faces project. Licensed under Creative Commons BY-NC-SA 2.0.
    //     Powered by imgix, which totally solves images on the web. No, seriously.
    //     Placemat is a Paul Straw jam. You can check out the source on GitHub.
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
        SERVICE = 'https://placem.at',
        CATEGORY = ['people', 'places', 'things'],
        MIN_WIDTH = 100,
        MIN_HEIGHT = 100,
        MAX_WIDTH = 1000,
        MAX_HEIGHT = 1000,
        RANDOM = 1

    const rand = function (minNum, MaxNum) {
        let len = arguments.length
        if (len === 0) {
            return Math.random()
        } else if (len > 1) {
            return Math.round(Math.random() * (MaxNum - minNum)) + minNum
        }
        return Math.round(Math.random() * minNum)
    }

    return function(req, res, next) {
        var location, params, category, query, random,
            widthInfo, heightInfo, minWidth, minHeight, maxWidth, maxHeight, source
        location = url.parse(req.url)
        if (!/^\/fake\/images(\/.*)?$/.test(location.pathname)) {
            next()
            return
        }
        params = location.pathname.replace(/^\/fake\/images\/?/, '').split('/')
        widthInfo = params[0] || null
        heightInfo = params[1] || null
        category = !params[2] || params[2] === 'any' || CATEGORY.indexOf(params[2]) === -1 ? CATEGORY[Math.floor(Math.random() * CATEGORY.length)] : params[2]
        random = params[3] || RANDOM
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
        source = `${SERVICE}/${category}?w=${width}&h=${height}&random=${random}`
        request.get(source).pipe(res)
    }
}
