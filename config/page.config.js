/**
 * html页面配置
 * 一个页面对应一个 new HtmlWebpackPlugin
 */


var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    pages: [
        new HtmlWebpackPlugin({
            filename: 'page1.html',
            template: 'src/page1.html',
            chunks: ['common','page1']
        }),
        new HtmlWebpackPlugin({
            filename: 'page2.html',
            template: 'src/page2.html',
            chunks: ['common','page2']
        }),
    ]
};