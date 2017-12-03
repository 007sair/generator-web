var cssnext = require("postcss-cssnext"); //http://cssnext.io/features/
var postuse = require('postcss-use'); //https://github.com/postcss/postcss-use
var pxtorem = require('postcss-pxtorem');
var short = require('postcss-short');

var config = {
    sass: {
        precision: 4 //保留小数点后几位 #https://github.com/sass/node-sass#precision
    },
    postCss: [
        cssnext({
            browsers: ['ie >= 9', 'Chrome >= 28', 'Android >= 4.0']
        }),
        short({
            position: { 
                skip: '_',  //默认*号跳过，改为'_'下划线是因为*号跳过在scss中会进行乘法运算
                prefix: 's' //只识别前缀为-s-的属性，因为position:-webkit-sticky有冲突
            },
            spacing: {
                skip: '_'
            }
        }),
        postuse({ //便于在.scss文件中直接使用
            modules: ['postcss-pxtorem']
        })
    ],
    cleanCss: {
        format: {
            breaks: {  //控制在哪里插入断点
                afterAtRule: true,
                afterBlockEnds: true,  //控制在一个块结束后是否有换行符,默认为`false`
                afterRuleEnds: true,   //控制在规则结束后是否有换行符;默认为`false`
                afterComment: true     //注释后是否换行，默认false
            }
        }
    },
    base64: {
        baseDir: './src/assets/base64',
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        maxImageSize: 4 * 1024, //bytes,
        deleteAfterEncoding: false,
        debug: false //是否在任务台显示信息
    }
};

module.exports = config;