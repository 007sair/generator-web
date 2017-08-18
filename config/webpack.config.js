/**
 * webpack config
 */

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var prod = gutil.env._[0] == 'dev' ? true : false;
var srcDir = path.resolve(process.cwd(), 'src');
var config = require('./plugin.config.js');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    return files;
}

var webpackConfig = {
    cache: true,
    devtool: prod ? "source-map" : '',
    entry: getEntry(),
    output: {
        path: path.join(process.cwd(), "dist/"),
        publicPath: "",
        filename: prod ? 'js/[name].js' : 'js/[name].js?v=[chunkhash:10]',
        chunkFilename: "js/[name].js"
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
        }
    },
    plugins: []
};

webpackConfig.plugins = [].concat(config.plugins);

module.exports = webpackConfig;