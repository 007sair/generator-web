/**
 * webpack config
 */

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');

var __DEV__ = gutil.env._[0] == 'dev' ? true : false;

var pageConfig = require('./page.config.js');
var dirVars = require('./dir-vars.config.js');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(dirVars.srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(dirVars.srcDir, 'js', item);
        }
    });
    return files;
}

var config = {
    devtool: __DEV__ ? 'eval' : '',
    entry: getEntry(),
    output: {
        path: path.resolve(dirVars.rootDir, "dist/"),
        publicPath: "/",
        filename: __DEV__ ? 'js/[name].min.js' : 'js/[name].min.js?v=[chunkhash:10]',
        chunkFilename: "js/[name].js"
    },
    resolve: {
        alias: {
            'Lib': path.resolve(dirVars.srcDir, './js/lib'),
            'Mod': path.resolve(dirVars.srcDir, './js/mod'),
            'CSS': path.resolve(dirVars.srcDir, './css')
        },
        extensions: ['.js', '.css', '.scss'],
    },
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
            assets: ['js/vendor.min.js'],
            files: '*.html',
            append: false,
            hash: !__DEV__ ? true : false
        }),
        new webpack.DllReferencePlugin({
            context: dirVars.rootDir,
            manifest: require(path.resolve(dirVars.rootDir, "vendor.manifest.json")),
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(dirVars.srcDir, 'assets/sprites/'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(dirVars.distDir, 'images/icon-sprite.png'),
                css: [
                    [path.resolve(dirVars.srcDir, 'css/_sprites.scss'), {
                        format: 'scss_template_handlebars'
                    }]
                ]
            },
            spritesmithOptions: {
                padding: 20
            },
            apiOptions: {
                cssImageRef: "/images/icon-sprite.png"
            },
            customTemplates: { //自定义模板
                'scss_template_handlebars': path.resolve(dirVars.rootDir, 'config/scss.template.handlebars')
            },
        }),
    ]
};

config.plugins = config.plugins.concat(pageConfig);

module.exports = config;