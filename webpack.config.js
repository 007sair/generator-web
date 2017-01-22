var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css样式从js文件中分离出来,需要通过命令行安装 extract-text-webpack-plugin依赖包
var autoprefixer = require('autoprefixer');

/*
 * plugins 是插件项
 * entry 是页面入口文件配置，output 是对应输出项配置（即入口文件最终要生成什么名字的文件、存放到哪里）
 */

//todo postcss/localhost

module.exports = {
	entry: './index.js',
	output: {
		filename: 'webpack/bundle.js'
	},
	module: {
		loaders: [
			//.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", 'css')},
            //解析.scss文件,对于用 import 或 require 引入的sass文件进行加载，以及<style lang="sass">...</style>声明的内部样式进行加载
			//.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
			//这里用了样式分离出来的插件，如果不想分离出来，可以直接这样写 loader:'style!css!sass'
			{ test: /\.scss$/, loader: ExtractTextPlugin.extract("style", 'css!sass')}
		]
	},
	plugins: [
		new ExtractTextPlugin("webpack/style.css"), //提取出来的样式放在style.css文件中
		new webpack.optimize.UglifyJsPlugin({ //代码压缩 其实并不能说是在压缩css代码，本质来说还是压缩js代码，再将这块代码输出到css文件中。
			compress: {
				warnings: false
			}
		})
	]
}	