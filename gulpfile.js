/**
 * 脚手架项目
 * gulp + webpack.dll + webpack
 * created by lc
 */

var gulp = require('gulp');
var path = require('path');
var os = require('os');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var gulpOpen = require('gulp-open');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var webpack = require('webpack');
var connect = require('gulp-connect');
var gulpSequence = require('gulp-sequence');  //- gulp串行任务   //gulpSequence：圆括号串行，中括号并行
var postCss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var svgSprite = require("gulp-svg-sprites");
var svgmin = require('gulp-svgmin');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var base64 = require('gulp-base64');

var replace = require('gulp-replace');
var revFormat = require('gulp-rev-format');
var revReplace = require('gulp-rev-replace');

require('shelljs/global');

//config
var cssConfig = require('./config/css.config.js');
var spriteConfig = require('./config/sprite.config.js');

//环境判断
var isProd = gutil.env._[0] == 'dev' ? true : false;

//mac chrome: "Google chrome"
var browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

//压缩合并生成新的css文件，生产环境有版本号功能
gulp.task('sass', function () {
    return gulp.src(['src/css/*.scss', 'src/css/**/*.css'], { base: 'src/css/' })
               .pipe(gulpif(isProd, sourcemaps.init()))
               .pipe(base64(cssConfig.base64))
               .pipe(sass(cssConfig.sass)
               .on('error', sass.logError))
               .pipe(postCss(cssConfig.postCss))
               .pipe(gulpif(isProd, cleanCSS(cssConfig.cleanCss)))
               .pipe(gulpif(!isProd, cleanCSS()))
               .pipe(gulpif(isProd, sourcemaps.write('.')))
               .pipe(gulp.dest('dist/css/'))
               .pipe(gulpif(isProd, connect.reload()))
               .pipe(gulpif(!isProd, rev()))
               .pipe(gulpif(!isProd, revFormat({
                    prefix: '.', // 在版本号前增加字符  
                    suffix: '.cache', // 在版本号后增加字符  
                    lastExt: false
                })))
               .pipe(gulpif(!isProd, rev.manifest('css-version.json')))
               .pipe(gulpif(!isProd, gulp.dest('./rev')))
});

//引用webpack对公共库进行dll打包，生成vendor.js
gulp.task("build-dll-js", function (callback) {
    webpack(require('./config/webpack.dll.config.js')).run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dll-js", err);
        if (!isProd) {
            gutil.log("[webpack:build-dll-js]", stats.toString({
                colors: true
            }));
        }
        callback();
    });
});

//引用webpack对js进行合并压缩提取，并生成html页面到dist下
gulp.task("build-js", ['build-dll-js'], function (callback) {
    webpack(require('./config/webpack.config.js')).run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-js", err);
        if (!isProd) {
            gutil.log("[webpack:build-js]", stats.toString({
                colors: true
            }));
        }
        callback();
    });
});

//合并src/sprites目录下的png到dist/images下，并生成_sprites.scss到src/css下
gulp.task('sprite:image', function (done) {
    var spriteData = gulp.src('src/assets/sprites/*.png')
        .pipe(spritesmith(spriteConfig.image));
    spriteData.img.pipe(imagemin()).pipe(gulp.dest('dist/images'));
    spriteData.css.pipe(gulp.dest('src/css'));
    done()
});

//添加版本号
gulp.task('add-version', function () {
    var manifest = gulp.src(["./rev/css-version.json"]);
    function modifyUnreved(filename) {
        return filename;
    }
    function modifyReved(filename) {
        //filename是：admin.69cef10fff.cache.css的一个文件名  
        //在这里才发现刚才用gulp-rev-format的作用了吧？就是为了做正则匹配，  
        if (filename.indexOf('.cache') > -1) {
            //通过正则和relace得到版本号：69cef10fff  
            var _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
            //把版本号和gulp-rev-format生成的字符去掉，剩下的就是原文件名：admin.css  
            var _filename = filename.replace(/\.[\w]*\.cache/, "");
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
        .pipe(gulp.dest('./'));
});

//监听
gulp.task('watch', function (done) {
    gulp.watch(['src/**/*.scss', 'src/**/*.css'], ['sass']);
    gulp.watch(['src/**/*.html', 'src/**/*.js'], ['build-js']).on('change', function (event) {
        gulp.src(['src/**/*.html', 'src/**/*.js']).pipe(connect.reload())
    });
    gulp.watch(['src/assets/img/**', 'src/assets/data/**'], ['copy']);
    gulp.watch('src/assets/sprites/**', ['sprite:image']);
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

gulp.task('clean', function(done) {
    rm('-rf', 'dist/');
    rm('-rf', 'rev/');
    rm('-rf', 'svg.html');
    done();
})


//开发环境
gulp.task('dev', ['clean'], function (cb) {
    gulpSequence('sprite:image', ['build-js', 'sass'], ['copy', 'sprite:svg'], ['connect', 'open'], 'watch', cb);
});

//生产环境
gulp.task('build', ['clean'], function(cb) {
    gulpSequence('sprite:image', ['build-js', 'sass'], 'add-version', ['copy', 'sprite:svg'], cb);
});

//生产环境带查看效果
gulp.task('build:watch', ['clean'], function(cb) {
    gulpSequence('sprite:image', ['build-js', 'sass'], 'add-version', ['copy', 'sprite:svg'], ['connect', 'open'], 'watch', cb);
});