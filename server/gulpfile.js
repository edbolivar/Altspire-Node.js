var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var server = require('gulp-develop-server');
var tsc = require('gulp-typescript');
var tslint = require("gulp-tslint");
var lintreporter = require('gulp-tslint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var tsconfig = require('./tsconfig.json');

var cwd = process.cwd();



tsconfig.compilerOptions.typescript = require('typescript');
//tsconfig.compilerOptions.rootDir = undefined;
//tsconfig.compilerOptions.outDir = undefined;
var tsProject = tsc.createProject(tsconfig.compilerOptions);


gulp.task('setenv', function (done) {
    var argv = require('minimist')(process.argv.slice(2));
    console.log("setenvironment.argv",argv) ;

    var srcFile = "./src/environments/environment." + argv.env + ".ts" ;
    var targetFile = "./src/environments/environment.ts" ;

    console.log("sourceFile",srcFile) ;

    gulp.src(srcFile)
		.pipe(rename(targetFile))
        .pipe(gulp.dest('.'));
});


gulp.task('tsc', function (done) {
	var tscFiles = [path.join(cwd,'src/**/*.ts'), path.join(cwd, 'typings/main.d.ts')];
	var tsResult = gulp.src(tscFiles)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));
	var stream = tsResult.js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.join(cwd, 'dist')));
	stream.on('end', done);
	stream.on('error', done);
});

gulp.task('tslint', function (done) {
	var tslintFiles = [path.join(cwd,'src/**/*.ts')];
	var stream = gulp.src(tslintFiles)
		.pipe(tslint())
		//.pipe(tslint.report('verbose'));
		.pipe(tslint.report(lintreporter, {
			emitError: false,
			sort: true,
			bell: true
		}));
	stream.on('end', done);
	stream.on('error', done);
});

gulp.task('watch', ['tsc', 'tslint'], function (done) {
	var srcFiles = [path.join(cwd,'src/**/*.ts')];
	gulp.watch(srcFiles, ['tsc']);
	done();
});

// run server
//gulp.task('server:start', ['tsc', 'tslint'], function (done) {
gulp.task('server:start', ['tsc'], function (done) {
	process.chdir('dist');
	server.listen({
		path: 'index.js',
		env: {
			NODE_ENV: 'development'
		},
        execArgv : ['--inspect=41234', '--nolazy']
	});
	done();
});

gulp.task('server:start:debug', ['tsc', 'tslint'], function (done) {
	process.chdir('dist');
	server.listen({
		path: 'index.js',
		env: {
			NODE_ENV: 'development'
		},
		execArgv : ['--inspect-brk=41234', '--nolazy']
	});
	done();
});

gulp.task('server:restart', ['tsc'], function (done) {
	console.log('server:restart');
	server.restart();
	done();
});

// restart server if src.js changed
gulp.task('serve', ['server:start'], function () {
	var srcFiles = [path.join(cwd,'src/**/*.ts')];
	gulp.watch(srcFiles, ['server:restart']);
});

gulp.task('serve:debug', ['server:start:debug'], function () {
	var srcFiles = [path.join(cwd,'src/**/*.ts')];
	gulp.watch(srcFiles, ['server:restart']);
});
