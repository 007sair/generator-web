var rem = require('./lib/rem640.js') //根据 /src/css/_config.scss 的$output输出，引用不同的脚本


document.body.addEventListener('click', function() {

	//点击body时异步加载module1.js
	require.ensure(["./mods/module1.js"], function(require) {
		var module2 = require("./mods/module2.js");
		document.title = module2.title
	}, 'module1');

}, false)