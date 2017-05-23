var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var config = {
    plugins: [
        new CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['common','index']
        }),
        new HtmlWebpackPlugin({
            filename: 'page2.html',
            template: 'src/page2.html',
            chunks: ['common','page2']
        }),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};


module.exports = config;