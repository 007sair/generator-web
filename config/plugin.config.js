/**
 * webpack plugins config
 */

var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
var path = require('path');
var gutil = require('gulp-util');
var prod = gutil.env._[0] == 'dev' ? true : false;

var pageConfig = require('./page.config.js');

var config = {
    plugins: [
        new CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        }),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['js/vendor.js'],
            files: '*.html',
            append: false,
            hash: !prod ? true : false
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(process.cwd(), "dist/js/vendor.manifest.json")),
        })
    ]
};

config.plugins = config.plugins.concat(pageConfig.pages);

module.exports = config;
