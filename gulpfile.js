var gulp = require('gulp'); //gulp
var watch = require('gulp-watch') //gulp-watch
var sass = require('gulp-sass'); //sass
var plumber = require('gulp-plumber'); //タスクが強制停止防止
var imagemin = require('gulp-imagemin'); //画像圧縮 書き出し
var webserver = require('gulp-webserver'); //簡易サーバーみたいなの
var pleeease = require('gulp-pleeease'); // prefix min
var html5Lint = require('gulp-html5-lint'); //HTML5構文チェック
var notify = require('gulp-notify'); //デスクトップ通知
var concat = require('gulp-concat'); //JS 結合
var uglify = require('gulp-uglify'); //JS 圧縮
var ignore = require('gulp-ignore'); //空フォルダ未出力

/*-------------------- Task - copy --------------------*/
gulp.task('copy',function(){
	return gulp.src(['./src/**/*','!./src/**/*.css','!./src/**/*.scss'])
	.pipe(ignore.include({isFile: true}))
	.pipe(gulp.dest('./_dist/'));
});

/*-------------------- Task - HTML5 lint --------------------*/

//gulp.task('html5-lint',function(){
//	return gulp.src('./src/**/*.html')
//	.pipe(plumber({
//		errorHandler: notify.onError("Error: <%= error.message %>")
//	}))
//	.pipe(html5Lint());
//});

/*-------------------- Task - sass --------------------*/
/*------------------------
/coomon/*.css - 共通のCSS
/css/*.css    - ページ別CSS
上のディレクトリを想定
------------------------*/
gulp.task('sass', function(){
	//各ページ系CSS
	gulp.src(['./src/scss/*.scss'])
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	}))
	.pipe(sass({outputStyle:'expanded'}))
	.pipe(pleeease({
		autoprefixer: {'browsers': ['last 2 versions', 'ie 9']},
		//rem: ["10px"],
        minifier: false // minify無効
    }))
	.pipe(gulp.dest('./_dist/css'));
});

/*-------------------- Task - watch --------------------*/
gulp.task('watch',function(){
	//sassファイルが変更、追加された場合　task sass を実行
	watch(['./src/**/*.scss','./src/**/*.css'], function() {
		gulp.start('sass');
	});
	//ファイルが変更、追加された場合　task copy を実行
	watch('./src/**/*', function() {
		gulp.start('copy');
	});
	//HTMLが変更されたら構文チェックを行う（HTML5）
	//watch('./src/**/*.html', function() {
	//	gulp.start('html5-lint');
	//});
});

/*-------------------- Task - imagemin --------------------*/
gulp.task('imagemin',function(){
	gulp.src('./src/**/*.{jpg,png,gif}')
	.pipe(imagemin())
	.pipe(gulp.dest('./_dist/'));
});

/*-------------------- Task - webserver --------------------*/
gulp.task('webserver', function() {
	gulp.src('./_dist') //Webサーバーで表示するサイトのルートディレクトリを指定
    .pipe(webserver({
    	host:'localhost',
		livereload:true //livereload 有効化
      	//directoryListing: true //ディレクトリ一覧を表示するか。オプションもあり
    }));
});

/*-------------------- Task - jsmin --------------------*/
gulp.task('jsmin', function() {
	gulp.src('./src/common/js/*.js')
	.pipe(concat('main.js')) //JSを結合
    .pipe(uglify({preserveComments: 'some'})) //結合したものを圧縮
    .pipe(gulp.dest('./_dist/common/js/'));
});

/*-------------------- Task - default --------------------*/
gulp.task('default',['copy','sass','watch','webserver']);
