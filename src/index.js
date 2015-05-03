'use strict'

var debug = require('debug')('metalsmith-jade')
var jade = require('jade')
var jade_filters = require('jade/lib/filters')
var jade_runtime = require('jade/lib/runtime')
var path = require('path')
var util = require('util')

/**
 * Metalsmith plugin to convert jade files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin (options) {
  options = options || {}
  options.locals = options.locals || {}

  return function (files, metalsmith, done) {
    setImmediate(done)

    if (options.useMetadata) {
      options.locals = util._extend(options.locals, metalsmith.metadata())
    }

    Object.keys(files).forEach(function (file) {
      debug('checking file: %s', file)

      if (!/\.jade/.test(path.extname(file))) {
        return
      }

      var data = files[file]
      var dir = path.dirname(file)
      var name = path.basename(file, path.extname(file))

      // do need to add an extension
      if (path.extname(name) === '') {
        name = path.basename(file, path.extname(file)) + '.html'
      }

      var locals = options.locals

      if (dir !== '.') {
        name = dir + '/' + name
      }

      debug('converting file: %s', file)

      options.filename = path.join(metalsmith.source(), file)

      if (options.useMetadata) {
        locals = util._extend(options.locals, data)
      }

      var str = jade.compile(data.contents.toString(), options)(locals)

      data.contents = new Buffer(str)

      delete files[file]

      files[name] = data
    })
  }
}

/**
 * Register a filter with jade using a factory method which returns the actual
 * filter method
 */
plugin.registerFilter = function (name, factory) {
  jade_filters[name] = factory(jade, jade_runtime, jade_filters)
}

// Expose `plugin`

module.exports = plugin
