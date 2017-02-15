/**
 * 脚手架项目
 * create by lc
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
    md5 = require('gulp-md5-plus'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    connect = require('gulp-connect');

require('shelljs/global')

var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
var gulpSequence = require('gulp-sequence');   					//- gulp串行任务
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');


var processors = [
	autoprefixer({
		browsers: ['ie >= 9', 'Chrome >= 20', 'Android >= 3.0', 'Firefox >= 10']
	})
];

var isProduction = gutil.env._[0] == 'dev';


var host = {
    path: 'dist/',
    port: 3000,
    html: 'index.html'
};

//mac chrome: "Google chrome", 
var browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');

//压缩合并css
gulp.task('sassmin', function (done) {
    if (isProduction) { //dev
        gulp.src(['src/css/sass/main.scss', 'src/css/style.css'], {base: 'src/css/'})
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css/'))
            .pipe(connect.reload())
    } else {
        gulp.src(['src/css/sass/main.scss', 'src/css/style.css'], {base: 'src/css/'})
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(cleanCSS())
            // .pipe(rev())
            .pipe(gulp.dest('./dist/css/'))
            // .pipe(rev.manifest())
            // .pipe(gulp.dest('./rev'))
    }
    done()
});


gulp.task('clean', function (done) {
    rm('-rf', 'dist/');
    done();
});

gulp.task('html', function(done){
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload())
    done()
});

gulp.task('rev:before', function(done){
    gulp.src(['dist/**/*.css'])
        .pipe(rev())
        .pipe(gulp.dest('./dist/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'))
    done()
})

gulp.task('rev', ['rev:before'], function(done) {
    gulp.src(['./rev/*.json', './src/**/*.html'])   		//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                           //- 执行文件内css名的替换
        .pipe(gulp.dest('dist/'))                   	//- 替换后的文件输出的目录
    done()
});


gulp.task('watch', function (done) {
    gulp.watch('src/**/*.scss', ['sassmin']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('src/**/*.js', ['build-js']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('src/**/*.html', ['html']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
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

var myDevConfig = Object.create(webpackConfig);
var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build-js", function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('md5:js', ['build-js'], function(done) {
    gulp.src('dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'))
    done()
})


//gulpSequence：圆括号串行，中括号并行

//发布
gulp.task('default', ['clean'], function(cb) {
    // gulp.start('connect', 'sassmin', 'md5', 'rev', 'open')
    gulpSequence('sassmin', 'rev', 'connect', 'open', cb);
});

//开发
gulp.task('dev', function(cb) {
    gulpSequence('clean', ['html', 'sassmin', 'build-js', 'connect', 'open'], 'watch', cb);
});

