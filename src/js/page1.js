import './lib/rem750';
import $ from "./lib/zepto";


// document.body.addEventListener('click', function () {
//     require.ensure(['./mod/utils.js'], function (require) {
//         var utils = require('./mod/utils.js');
//         console.log(utils)
//     }, 'tool');
// })

let a = 1,
    b = 4;

function add(m, n) {
    return m + n
}

console.log(add(a, b));
