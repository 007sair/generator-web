/**
 * 公共库 dll 打包
 */

var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        vendor: [
            path.join(process.cwd(), "src/js/lib/zepto.js")
        ],
    },
    output: {
        path: path.join(process.cwd(), "dist/js/"),
        filename: '[name].js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(process.cwd(), "rev/vendor.manifest.json"),
            name: '[name]_library',
            context: __dirname
        })
    ]
};