const {src, dest, watch, parallel, series} = require('gulp')
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const gcmq = require('gulp-group-css-media-queries');
const fileinclude = require('gulp-file-include');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');


 async function include() {
   return src(['src/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

function images() {
  return src('src/images/**/*')
		.pipe(imagemin(
      [
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]
    ))
		.pipe(dest('dist/images'))
  
  
}

function scripts() {
  return src([
    'src/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('dist/js'))
  .pipe(browserSync.stream());
}


function browsersync() {
  browserSync.init({
    server: {
        baseDir: "dist/"
    }
});
}

function styles() {
    return src('src/scss/main.scss')
      .pipe(scss())
      .pipe(concat('main.min.css'))
      .pipe( autoprefixer({ 
        overrideBrowserslist: ['last 10 version'],
        grid: true
      }))
      .pipe(gcmq())
      .pipe(postcss([cssnano()]))
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream());

  }

  function fonts() {
    return src('src/fonts/**/*')
      .pipe(dest('dist/fonts'))
      

  }


  function watching(){
    watch(['src/scss/**/*.scss'], styles );
    watch(['src/js/**/*.js'], scripts );
    watch(['src/*.html'], include);
    watch(['src/fonts/*'], fonts);
  }

  async function cleanDist() {
    const deletedPaths = await del(['dist'], {dryRun: false})
  }

  


  exports.styles = styles;
  exports.watching = watching;
  exports.browsersync = browsersync;
  exports.scripts = scripts;
  exports.images = images;
  exports.cleanDist = cleanDist;
  exports.include = include;
  exports.fonts = fonts;
     
  const mainTasks = parallel(images, fonts, styles, scripts, include);
  const dev = series (cleanDist, mainTasks, parallel (browsersync, watching));
  const build = series (cleanDist, mainTasks);
  exports.build = (build);
  exports.default = (dev);