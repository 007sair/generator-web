console.log('main1')

document.body.addEventListener('click', function() {

	//异步加载module1.js
	require.ensure(["./mods/module1.js"], function(require) {
		var module2 = require("./mods/module1.js");
	}, 'module1');
	
	
}, false)
