/**
 * rem脚本js
 * ----------------
 * 根据 /src/css/_config.scss 中的变量 $output 的值引入对应js
 *   $output: 640    ->   ./lib/rem640.js
 *   $output: 750    ->   ./lib/rem750.js
 */
require('./lib/rem750.js');

var $ = require('./lib/zepto.js');

// document.body.addEventListener('click', function () {
//     require.ensure(['./mod/utils.js'], function (require) {
//         var utils = require('./mod/utils.js');
//         console.log(utils)
//     }, 'tool');
// })

var a = 1,
    b = 4;

function add(m, n) {
    return m + n
}

console.log(add(a, b));
