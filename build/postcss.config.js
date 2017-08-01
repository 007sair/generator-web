/**
 * postcss plugins
 */

var cssnext = require("postcss-cssnext"); //http://cssnext.io/features/
var postuse = require('postcss-use'); //https://github.com/postcss/postcss-use

module.exports = {
    config: [
        cssnext({
            browsers: ['ie >= 9', 'Chrome >= 20', 'Android >= 3.0', 'Firefox >= 10']
        }),
        require('postcss-short')({ //使用'_'下划线跳过，默认的星号跳过在scss中会被运算
            position: {
                skip: '_',
                prefix: 's' //只识别-s-position属性，因为position:-webkit-sticky有误
            },
            spacing: {skip: '_'}
        }),
        postuse({
            modules: ['pixrem']
        })
    ]
};