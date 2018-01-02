module.exports = function (file) {

    //
    // [ express middleware ]
    // Handle 404 [page] not found
    // --------------------------------------------------------------------------------
    //

    const fs = require('fs')
    const path = require('path');

    if (!file) {
        file = path.resolve(__dirname, '../html/404.html');
    }

    return function (req, res) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (!err) {
                res.end(data);
            }
            res.end('[ 404 ] page not found.')
        });
    };
};
