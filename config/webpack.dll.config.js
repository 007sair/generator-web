/**
 * 公共库 dll 打包
 */

var webpack = require('webpack');
var path = require('path');
var dirVars = require('./dir-vars.config.js');

module.exports = {
    entry: {
        vendor: [
            path.resolve(dirVars.srcDir, "js/lib/zepto.js")
        ],
    },
    output: {
        path: path.resolve(dirVars.distDir, "js/"),
        filename: '[name].min.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(dirVars.rootDir, "vendor.manifest.json"),
            name: '[name]_library',
            context: dirVars.rootDir
        })
    ]
};