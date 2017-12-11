// imports
import '_lib/rem750';
import '_mod/svg.js';
import $ from "_lib/zepto";

// test code splite
document.body.addEventListener('click', function () {
    require.ensure(['_mod/utils.js'], function (require) {
        let utils = require('_mod/utils.js');
        console.log(utils)
    }, 'tool');
})

// test es6
let arr = [4, 5, 6];
let fn = (x, y, z) => {
    return x + y + z
};
console.log(fn(...arr));
