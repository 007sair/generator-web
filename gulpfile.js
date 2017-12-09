/**
 * 脚手架项目
 * gulp + webpack.dll + webpack
 * created by lc
 */

const gulp = require('gulp');
const webpack = require('webpack');
const path = require('path');
const os = require('os');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const gulpOpen = require('gulp-open');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const gulpSequence = require('gulp-sequence');  //- gulp串行任务   //gulpSequence：圆括号串行，中括号并行
const postCss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const svgSprite = require("gulp-svg-sprites");
const svgmin = require('gulp-svgmin');
const base64 = require('gulp-base64');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const replace = require('gulp-replace');
const revFormat = require('gulp-rev-format');
const revReplace = require('gulp-rev-replace');

require('shelljs/global');

//config
let cssConfig = require('./config/css.config.js');
let spriteConfig = require('./config/sprite.config.js');
let dirVars = require('./config/dir-vars.config.js');

//环境判断
let __DEV__ = gutil.env._[0] == 'dev' ? true : false;

//mac chrome: "Google chrome"
let browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

//压缩合并生成新的css文件，生产环境有版本号功能
gulp.task('sass', function () {
    return gulp.src(['src/css/*.scss', '!src/**/_*.scss'], { base: 'src/css/' })
        .pipe(gulpif(__DEV__, sourcemaps.init()))
        .pipe(base64(cssConfig.base64))
        .pipe(sass(cssConfig.sass)
            .on('error', sass.logError))
        .pipe(postCss(cssConfig.postCss))
        .pipe(gulpif(__DEV__, cleanCSS(cssConfig.cleanCss)))
        .pipe(gulpif(!__DEV__, cleanCSS()))
        .pipe(gulpif(__DEV__, sourcemaps.write('.')))
        .pipe(gulp.dest('dist/css/'))
        .pipe(gulpif(__DEV__, connect.reload()))
        .pipe(gulpif(!__DEV__, rev()))
        .pipe(gulpif(!__DEV__, revFormat({
            prefix: '.', // 在版本号前增加字符  
            suffix: '.cache', // 在版本号后增加字符  
            lastExt: false
        })))
        .pipe(gulpif(!__DEV__, rev.manifest('css.manifest.json')))
        .pipe(gulpif(!__DEV__, gulp.dest('./')))
});

//引用webpack对公共库进行dll打包，生成vendor.js
gulp.task("build-dll-js", function (callback) {
    webpack(require('./config/webpack.dll.config.js')).run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dll-js", err);
        if (!__DEV__) {
            gutil.log("[webpack:build-dll-js]", stats.toString({
                colors: true
            }));
        }
        callback();
    });
});

//引用webpack对js进行合并压缩提取，并生成html页面到dist下
gulp.task("build-js", function (callback) {
    webpack(require('./config/webpack.config.js')).run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-js", err);
        if (!__DEV__) {
            gutil.log("[webpack:build-js]", stats.toString({
                colors: true
            }));
        }
        callback();
    });
});

//添加版本号
gulp.task('add-version', function () {
    let manifest = gulp.src(["./css.manifest.json"]);
    function modifyUnreved(filename) {
        return filename;
    }
    function modifyReved(filename) {
        //filename是：admin.69cef10fff.cache.css的一个文件名  
        //在这里才发现刚才用gulp-rev-format的作用了吧？就是为了做正则匹配，  
        if (filename.indexOf('.cache') > -1) {
            //通过正则和relace得到版本号：69cef10fff  
            let _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
            //把版本号和gulp-rev-format生成的字符去掉，剩下的就是原文件名：admin.css  
            let _filename = filename.replace(/\.[\w]*\.cache/, "");
            //重新定义文件名和版本号：admin.css?v=69cef10fff  
            filename = _filename + "?vcss=" + _version;
            //返回由gulp-rev-replace替换文件名  
            return filename;
        }
        return filename;
    }
    gulp.src(['./dist/*.html'])
        //删除原来的版本
        .pipe(replace(/(\.[a-z]+)\?(v=)?[^\'\"\&].css/g, "$1"))
        .pipe(revReplace({
            manifest: manifest,
            modifyUnreved: modifyUnreved,
            modifyReved: modifyReved
        }))
        .pipe(gulp.dest('dist/'));
});


//复制src/assets/data目录到dist/data下
gulp.task('copy:data', function () {
    return gulp.src(['src/assets/data/**/*'])
        .pipe(gulp.dest('dist/data'))
});

//复制src/assets/img目录到dist/img下
gulp.task('copy:images', function () {
    return gulp.src(['src/assets/img/**/*'])
        .pipe(gulp.dest('dist/images'))
});

gulp.task('copy', ['copy:images', 'copy:data']);

//合并src/assets目录下的svg到dist下，并生成一个svg.html页面用于预览svg icon
gulp.task('sprite:svg', function () {
    return gulp.src('src/assets/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgSprite(spriteConfig.svg))
        .pipe(gulp.dest('./dist/'));
});

//监听
gulp.task('watch', function (done) {
    gulp.watch(['src/**/*.scss', '!src/**/_*.scss'], ['sass']).on('change', function (event) {
        // console.log(event);
    });
    gulp.watch(['src/*.html', 'src/**/*.js'], ['build-js']).on('change', function (event) {
        // console.log(event);
        gulp.src(['src/*.html', 'src/**/*.js']).pipe(connect.reload())
    });
    gulp.watch(['src/assets/img/**', 'src/assets/data/**'], ['copy']);
    gulp.watch('src/assets/sprites/**', ['build-js']);
    gulp.watch('src/assets/svg/**', ['sprite:svg']);
    gulp.watch('src/assets/base64/**', ['sass']);
    done()
});

gulp.task('connect', function (done) {
    connect.server({
        root: 'dist/',
        port: 3000,
        livereload: true
    });
    done()
});

gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/'
        }))
    done()
});

gulp.task('clean', function (done) {
    rm('-rf', 'dist/');
    rm('-rf', 'rev/');
    done();
})


//开发环境
gulp.task('dev', ['clean'], function (cb) {
    gulpSequence('build-dll-js', 'build-js', 'sass', ['copy', 'sprite:svg'], ['connect', 'open'], 'watch', cb);
});

//生产环境
gulp.task('build', ['clean'], function (cb) {
    gulpSequence('build-dll-js', 'build-js', 'sass', 'add-version', ['copy', 'sprite:svg'], cb);
});

//生产环境带查看效果
gulp.task('build:watch', ['clean'], function (cb) {
    gulpSequence('build-dll-js', 'build-js', 'sass', 'add-version', ['copy', 'sprite:svg'], ['connect', 'open'], 'watch', cb);
});