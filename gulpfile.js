// 'use strict';

// var gulp = require('gulp');
// var shell = require('gulp-shell');
// var minimist = require('minimist');
// var rename = require('gulp-rename');
// var debug = require('gulp-debug');
// var del = require('del');
// var runSequence = require('run-sequence');
// var headerfooter = require('gulp-headerfooter');
// var deleteLines = require('gulp-delete-lines');

// // minimist structure and defaults for this task configuration
// var knownOptions = {
//   'string': ['env'],
//   'default': {
//     env: 'dev'
//   }
// };
// var options = minimist(process.argv.slice(2), knownOptions);

// // The root working directory where code is edited
// var srcRoot = 'dist';
// // The base of the destination root
// var dstBase = 'build/' + options.env;
// // The root staging folder for gapps upload
// var dstRoot = dstBase + '/src';
// var serverRoot = 'serverCode';

// gulp.task('upload-latest', function () {

//   console.log('\n\n  **************************');
//   console.log('  **  Env:', options.env);
//   console.log('  **************************');
//   console.log('\n');

//   runSequence(
//     'ng-build',
//     'assess-deployment-options',
//     'clean-deployment',
//     'copy-angular-code',
//     'copy-index-file',
//     'copy-server-code',
//     'gapps-upload'
//   )
// });

// gulp.task('ng-build', shell.task(['ng build']));

// // Requires user to confirm they want to push to production via '--confirm-on-master'
// gulp.task('assess-deployment-options', function (cb) {
//   if (options.env === 'prod' && !options['confirm-on-master']) return cb('\n\nWhoa! You can`t push to production without confirming that you`re on your master branch.  Use `--confirm-on-master`\n\n');
//   cb(null);
// });

// // Appends ".html" to any js that will be included in client code
// // Then copies those .html files to the upload staging folder.
// gulp.task('copy-angular-code', function (callback) {
//   return gulp.src([
//     srcRoot + '/*.js'])
//     .pipe(
//     rename(function (path) {
//       if (path.extname !== '.html' && path.extname !== '.map') {
//         path.extname = path.extname + '.html';
//       }
//       return path;
//     }))
//     .pipe(headerfooter.header('<script>\n'))
//     .pipe(headerfooter.footer('\n</script>'))
//     .pipe(gulp.dest(dstRoot));
// });

// // Copies index file
// gulp.task('copy-index-file', function (callback) {
//   return gulp.src([
//     srcRoot + '/index.html'])

//   //delete script line, last body tag, and last html tag.
//   //these rows get recreated below.
//   .pipe(deleteLines({
//     'filters': [
//       /<script\s+type=["']text\/javascript["']\s+src=/i
//     ]
//   }))
//   .pipe(deleteLines({
//     'filters': [
//       /<\/html/
//     ]
//   }))

//   //update script files to use include statements
//   //append body and html tags at end of file
//   .pipe(headerfooter.footer("\n<?!= include('inline.bundle.js.html'); ?>\n"))
//   .pipe(headerfooter.footer("<?!= include('polyfills.bundle.js.html'); ?>\n"))
//   .pipe(headerfooter.footer("<?!= include('styles.bundle.js.html'); ?>\n"))
//   .pipe(headerfooter.footer("<?!= include('vendor.bundle.js.html'); ?>\n"))
//   .pipe(headerfooter.footer("<?!= include('main.bundle.js.html'); ?>\n"))
//   .pipe(headerfooter.footer("</body>\n </html>"))
//   .pipe(gulp.dest(dstRoot));
//   // .on('end', function () {
//   //   return callback(null);
//   // })
//   // .on('error', function (err) {
//   //   return callback(err);
//   // });
// });

// // Copies all .js that will be run by the Apps Script runtime
// gulp.task('copy-server-code', function (callback) {
//   return gulp.src([
//     serverRoot + '/*.js'])
//     .pipe(gulp.dest(dstRoot));
// });

// // Utility tasks
// gulp.task('clean-deployment', function(cb) {
//   return del([
//     dstRoot + '/*.*',
//     dstRoot + '/**/*.*'
//   ]);
// });
// gulp.task('copy-env-specific', function (callback) {
//   // if (options.env === 'dev') {
//   //   return gulp.src(srcRoot + '/**/*.js')
//   //     .pipe(jshint())
//   //     .pipe(jshint.reporter('jshint-stylish'));
//   // } else {
//   //   return callback(null);
//   // }
// });

// // Runs the node-google-apps-script gapps upload command line task for a single tool
// gulp.task('gapps-upload', shell.task(['gapps upload'], { cwd: dstBase }));

// // gulp.task('lint', function() {
// //   return gulp.src(srcRoot + '/**/*.js')
// //       .pipe(jshint())
// //       .pipe(jshint.reporter('jshint-stylish'));
// // });




'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var minimist = require('minimist');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var del = require('del');
var headerfooter = require('gulp-headerfooter');
var deleteLines = require('gulp-delete-lines');
var runSequence = require('run-sequence');

// minimist structure and defaults for this task configuration
var knownOptions = {
  string: ['env'],
  'default': {
    env: 'dev'
  }
};
var options = minimist(process.argv.slice(2), knownOptions);


// The root working directory where code is edited
var srcRoot = 'dist';
var serverRoot = 'serverCode';

// The root staging folder for gapps configurations
var dstRoot = 'build/' + options.env + '/src';



// Runs the copy-latest task, then calls gapps upload in the correct
// configuration directory based on the target environment
gulp.task('upload-latest', function(){
    runSequence(
      'ng-build',
      'copy-latest',
      'gapps-upload'
    )
});


gulp.task('ng-build', shell.task(['ng build']));

gulp.task('gapps-upload',shell.task(['gapps upload'],{cwd: 'build/' + options.env}));

// watch the changes and print them out
gulp.task('watch', function(){
  gulp.watch(['serverCode/*.*', 'src/*/*.*'],function(e){
    var paths = e.path.split('/');
    var path = paths.slice(8, paths.length).join('/');
    var time = new Date().toString().split(' ').slice(4,5);
    console.log(time + ' '+ path + ' was ' + e.type );
  })
});

// Copies all files based on the current target environment.
// Completion of "clean-deployment" is a prerequisite for starting the copy
// process.
gulp.task('copy-latest', ['clean-deployment'], function() {
  //copyEnvironmentSpecific();
  copyAngularServerCode();
  copyIndexFile();
  copyGoogleServerFiles();
});

//cm todo: add ng-build to gulp command

//ignores map files
//all js files converted to html files
//adds <script> tag to those files
function copyAngularServerCode() {
  return gulp.src([
    srcRoot + '/**.js'
  ])
  .pipe(
    rename(function(path) {
      if (path.extname !== '.html' && path.extname !== '.map') {
        path.extname = path.extname + '.html';
        }
        return path;
      }))
      .pipe(headerfooter.header('<script>\n'))
      .pipe(headerfooter.footer('\n</script>'))
      .pipe(gulp.dest(dstRoot)); //changed from dstRoot
}


//copies singular index file
function copyIndexFile() {
  return gulp.src([
    srcRoot + '/index.html'
  ])

  //delete script line, last body tag, and last html tag.
  //these rows get recreated below.
  .pipe(deleteLines({
    'filters': [
      /<script\s+type=["']text\/javascript["']\s+src=/i
    ]
  }))
  .pipe(deleteLines({
    'filters': [
      /<\/html/
    ]
  }))

  //update script files to use include statements
  //append body and html tags at end of file
  .pipe(headerfooter.footer("\n<?!= include('inline.bundle.js.html'); ?>\n"))
  .pipe(headerfooter.footer("<?!= include('polyfills.bundle.js.html'); ?>\n"))
  .pipe(headerfooter.footer("<?!= include('styles.bundle.js.html'); ?>\n"))
  .pipe(headerfooter.footer("<?!= include('vendor.bundle.js.html'); ?>\n"))
  .pipe(headerfooter.footer("<?!= include('main.bundle.js.html'); ?>\n"))
  .pipe(headerfooter.footer("</body>\n </html>"))
  .pipe(gulp.dest(dstRoot));
}


//copies js files for google server calls
function copyGoogleServerFiles() {
  return gulp.src([
    serverRoot + '/**.js'
  ])
  .pipe(gulp.dest(dstRoot));
}


// Utility tasks
gulp.task('clean-deployment', function(cb) {
  return del([
    dstRoot + '/*.*'
  ]);
});