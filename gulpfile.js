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
            .on('end', done)
    } else {
        gulp.src(['src/css/sass/main.scss', 'src/css/style.css'], {base: 'src/css/'})
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(cleanCSS())
            .pipe(rev())
            .pipe(gulp.dest('./dist/css'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./rev'))
            .on('end', done);
    }
});



gulp.task('sprite', function(){
	console.log('task sprite')
})

gulp.task('clean', function (done) {
    gulp.src(['dist', 'rev'])
        .pipe(clean());
    done();
});

gulp.task('html', function(done){
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload())
    //done()
})

gulp.task('reload', function(){
    gulp.src('src/**/*')
        .pipe(connect.reload())
})


gulp.task('rev', ['sassmin'], function(done) {
    return gulp.src(['./rev/*.json', './src/**/*.html'])   		//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                           //- 执行文件内css名的替换
        .pipe(gulp.dest('dist/'))                    	//- 替换后的文件输出的目录
    //done()
});


gulp.task('watch', function (done) {
    gulp.watch('src/**/*.scss', ['sassmin']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('src/**/*.html', ['html']).on('change', function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


gulp.task('connect', function () {
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/'
        }))
    //done()
});

//gulpSequence：圆括号串行，中括号并行

//发布
gulp.task('build', function(cb) {
    gulpSequence('clean', 'rev', ['connect', 'open'], cb);
});

//开发
gulp.task('dev', function(cb) {
    gulpSequence('clean', 'sassmin', ['html', 'connect', 'open'], 'watch', cb);
});

