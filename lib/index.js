var path = require('path');
var debug = require('debug')('metalsmith-jade');
var join = require('path').join;
var jade = require('jade');
var jade_runtime = require('jade/lib/runtime');
var jade_filters = require('jade/lib/filters');

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
  options.locals = options.locals || {};
  //var keys = options.keys || [];

  var mix = function(obj1, obj2) {
    var newObj = {};
    var key;
    for (key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        newObj[key] = obj1[key];
      }
    }
    for (key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        newObj[key] = obj2[key];
      }
    }
    return newObj;
  }

  return function(files, metalsmith, done){
    setImmediate(done);

    if (options.useMetadata) {
      options.locals = mix(options.locals, metalsmith.metadata());
    }

    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!isJade(file)) return;
      var data = files[file];
      var dir = path.dirname(file);
      var name = path.basename(file, path.extname(file));

      // do need to add an extension
      if (path.extname(name) === '') {
        name = path.basename(file, path.extname(file)) + '.html';
      }

      var locals = options.locals;
      if ('.' != dir) name = dir + '/' + name;

      debug('converting file: %s', file);
      options.filename = join(metalsmith.source(),file);
      if (options.useMetadata) {
        locals = mix(options.locals, data);
      }
      var str = jade.compile(data.contents.toString(), options)(locals);
      data.contents = new Buffer(str);
      //keys.forEach(function(key) {
      //  data[key] = marked(data[key], options);
      //});

      delete files[file];
      files[name] = data;
    });
  };
}

/**
 * Register a filter with jade using a factory method which returns the actual
 * filter method
 */
plugin.registerFilter = function(name, factory) {
  jade_filters[name] = factory(jade, jade_runtime, jade_filters);
}

/**
 * Check if a `file` is jade.
 *
 * @param {String} file
 * @return {Boolean}
 */

function isJade(file){
  return /\.jade/.test(path.extname(file));
}
