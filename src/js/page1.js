import './lib/rem750';
import $ from "./lib/zepto";


// document.body.addEventListener('click', function () {
//     require.ensure(['./mod/utils.js'], function (require) {
//         var utils = require('./mod/utils.js');
//         console.log(utils)
//     }, 'tool');
// })

let arr = [4, 5, 6];

var fn = (x, y, z) => {
    return x + y + z
};

console.log(fn(...arr));