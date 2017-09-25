var cssnext = require("postcss-cssnext"); //http://cssnext.io/features/
var postuse = require('postcss-use'); //https://github.com/postcss/postcss-use
var pxtorem = require('postcss-pxtorem');
var short = require('postcss-short');

var config = {
    postCss: [
        cssnext({
            browsers: ['ie >= 9', 'Chrome >= 20', 'Android >= 3.0', 'Firefox >= 10']
        }),
        short({
            position: { //使用'_'下划线跳过，默认的星号跳过在scss中会被运算
                skip: '_',
                prefix: 's' //只识别-s-position属性，因为position:-webkit-sticky有误
            },
            spacing: { skip: '_' }
        }),
        postuse({
            modules: ['pixrem', 'postcss-pxtorem']
        })
    ],
    cleanCss: {
        format: {
            breaks: {//控制在哪里插入断点
                afterAtRule: true,
                afterBlockEnds: true,//控制在一个块结束后是否有换行符,默认为`false`
                afterRuleEnds: true,//控制在规则结束后是否有换行符;默认为`false`
                afterComment: true //注释后是否换行，默认false
            }
        }
    },
    base64: {
        baseDir: './src/assets/base64',
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        maxImageSize: 8*1024, // bytes,
        deleteAfterEncoding: false,
        debug: true
    }
};

module.exports = config;