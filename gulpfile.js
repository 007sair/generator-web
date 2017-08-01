/**
 * 脚手架项目
 * created by lc
 */
var gulp = require('gulp'),
    os = require('os'),
    path = require('path'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    webpack = require('webpack'),
    webpackConfig = require('./build/webpack.config.js'),
    connect = require('gulp-connect');
    gulpSequence = require('gulp-sequence'),  //- gulp串行任务   //gulpSequence：圆括号串行，中括号并行
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin');
    

require('shelljs/global');
var svgSprite = require("gulp-svg-sprites");
var svgmin = require('gulp-svgmin');

/**
 * postcss plugins
 */
var cssnext = require("postcss-cssnext"); //http://cssnext.io/features/
var postuse = require('postcss-use'); //https://github.com/postcss/postcss-use

var processors = [  
    cssnext({
        browsers: ['ie >= 9', 'Chrome >= 20', 'Android >= 3.0', 'Firefox >= 10']
    }),
    require('postcss-short')({ //使用'_'下划线跳过，默认的星号跳过在scss中会被运算
        position: {skip: '_'},
        spacing: {skip: '_'}
    }),
    postuse({
        modules: ['pixrem']
    })
];

var prod = gutil.env._[0] == 'dev' ? true : false;

var host = {
    path: 'dist/',
    port: 3000,
    html: 'index.html'
};

//mac chrome: "Google chrome"
var browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');

//压缩合并css 生成环境生成为md5的文件
gulp.task('sassmin', function () {
    return gulp.src(['src/css/*.scss', 'src/css/**/*.css'], { base: 'src/css/' })
        .pipe(sourcemaps.init())
        .pipe(sass({
            precision: 4 //保留小数点后几位 #https://github.com/sass/node-sass#precision
        })
        .on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(cleanCSS({
            format: {
                breaks: {//控制在哪里插入断点
                    afterAtRule: true,
                    afterBlockEnds: true,//控制在一个块结束后是否有换行符,默认为`false`
                    afterRuleEnds: true,//控制在规则结束后是否有换行符;默认为`false`
                }
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(connect.reload())
});


//引用webpack对js进行操作 生成带有hash的html页
var myDevConfig = Object.create(webpackConfig);
var devCompiler = webpack(myDevConfig);
gulp.task("build-js", function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('copy:images', function (done) {
    rm('-rf', 'dist/images/');
    gulp.src(['src/images/**/*'])
        .pipe(gulp.dest('dist/images'))
        .on('end', done);
});

//雪碧图
gulp.task('sprite:image', function() {
    var spriteData = gulp.src('src/assets/sprites/*.png')
        .pipe(spritesmith({
            cssName: '_sprites.scss',
            cssFormat: 'scss',
            imgName: 'icon-sprite.png',
            imgPath: '../images/icon-sprite.png',
            padding: 20
        }));
    spriteData.img
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
    spriteData.css
        .pipe(gulp.dest('src/css'));
});

//合并svg
gulp.task('sprite:svg', function () {
    return gulp.src('src/assets/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgSprite({
            mode: "symbols",
            common: 'icon-svg',
            svgId: "svg-%f",
            preview: {
                symbols: 'svg.html'
            },
            svg: {
                symbols: 'images/svg-icon.svg'
            },
            cssFile: 'css/main.css'
        }))
        .pipe(gulp.dest("dist/"));
});


gulp.task('clean', function (done) {
    rm('-rf', 'dist/')
    done();
});

gulp.task('watch', function (done) {
    gulp.watch(['src/**/*.scss', 'src/**/*.css'], ['sassmin']);
    gulp.watch(['src/**/*.html', 'src/**/*.js'], ['build-js']).on('change', function (event) {
        gulp.src(['src/**/*.html', 'src/**/*.js']).pipe(connect.reload())
    });
    gulp.watch('src/images/**', ['copy:images']);
    gulp.watch('src/assets/sprites/**', ['sprite:image']);
    gulp.watch('src/assets/svg/**', ['sprite:svg']);
    done()
});

gulp.task('connect', function (done) {
    connect.server({
        root: host.path,
        port: host.port,
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

//开发
gulp.task('dev', ['clean'], function(cb) {
    gulpSequence('build-js', ['copy:images', 'sprite:image', 'sprite:svg', 'sassmin', 'connect', 'open'], 'watch', cb);
});