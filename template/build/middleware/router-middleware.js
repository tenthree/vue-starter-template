const fs = require('fs');

module.exports = function (routes) {

  //
  // [ express middleware ]
  // Custom URL route with page template file
  // --------------------------------------------------------------------------------
  //

  return function (req, res, next) {
    var isMatch = false,
      index = 0,
      len = routes.length,
      route,
      file;
    while (index < len) {
      route = routes[index];
      if (Array.isArray(route.from)) {
        isMatch = route.from.some(rule => rule.test(req.url));
        if (isMatch) {
          file = route.to;
        }
      } else {
        if (route.from.test(req.url)) {
          file = route.to;
          isMatch = true;
        }
      }
      if (isMatch) {
        if (file.substr(0, 1) === '/') {
          req.url = file;
          next();
        } else {
          fs.readFile(file, 'utf8', (err, data) => {
            if (!err) {
              res.end(data);
            }
          });
        }
        break;
      }
      index++;
    }
    if (!isMatch) {
      next();
    }
  };
};
