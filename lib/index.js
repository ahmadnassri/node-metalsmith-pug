var basename = require('path').basename;
var debug = require('debug')('metalsmith-jade');
var join = require('path').join;
var dirname = require('path').dirname;
var extname = require('path').extname;
var jade = require('jade');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert jade files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){
  options = options || {};
  //var keys = options.keys || [];

  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!isJade(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('converting file: %s', file);
      options.filename = join(metalsmith.dir,metalsmith._src,file);
      var str = jade.compile(data.contents.toString(), options)(options.locals);
      data.contents = new Buffer(str);
      //keys.forEach(function(key) {
      //  data[key] = marked(data[key], options);
      //});

      delete files[file];
      files[html] = data;
    });
  };
}

/**
 * Check if a `file` is jade.
 *
 * @param {String} file
 * @return {Boolean}
 */

function isJade(file){
  return /\.jade/.test(extname(file));
}