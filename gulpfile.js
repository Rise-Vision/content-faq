(function () {
  "use strict";

  var argv = require('minimist')(process.argv.slice(2));
  var colors = require("colors");
  var del = require("del");
  var deploy = require('gulp-gh-pages');
  var factory = require("widget-tester").gulpTaskFactory;
  var fs = require("fs");
  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var markdownDocs = require("gulp-markdown-docs");
  var path = require("path");
  var runSequence = require("run-sequence");

  gulp.task("bump", function(){
    return gulp.src(["./package.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("clean", function (cb) {
    del(['./dist-faq/**'], cb);
  });

  gulp.task("faq:server", ["build-faq"], factory.testServer({
    rootPath: "./dist-faq"
  }));

  gulp.task("build-faq", ["clean"], function (cb) {
    runSequence("md-to-html", cb);
  });

  gulp.task("md-to-html", function () {
    return gulp.src('faq/*.md')
      .pipe(markdownDocs('index.html', {
        yamlMeta: true,
        highlightTheme: 'github'
  }))
    .pipe(gulp.dest('./dist-faq/'));
  });

  /**
   *  Deploy to gh-pages
   */
  gulp.task("deploy-faq", function () {

    // Remove temp folder created by gulp-gh-pages
    if (argv.clean) {
      var os = require('os');
      var path = require('path');
      var repoPath = path.join(os.tmpdir(), 'tmpRepo');
      gutil.log('Delete ' + gutil.colors.magenta(repoPath));
      del.sync(repoPath, {force: true});
    }

    return gulp.src("./dist-faq/**/*")
      .pipe(deploy("https://github.com/Rise-Vision/content-faq.git"));
  });

  gulp.task("default", [], function() {
    console.log("********************************************************************".yellow);
    console.log("  gulp build-faq: build distribution of markdown files".yellow);
    console.log("********************************************************************".yellow);
    return true;
  });

})();
