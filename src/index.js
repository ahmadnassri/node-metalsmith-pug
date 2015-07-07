'use strict'

var debug = require('debug')('metalsmith-jade')
var jade = require('jade')
var path = require('path')
var util = require('util')

module.exports = function (options) {
  var opts = options || {}
  opts.locals = opts.locals || {}
  opts.filters = opts.filters || {}

  return function (files, metalsmith, done) {
    setImmediate(done)

    // extend with metalsmith global metadata
    if (opts.useMetadata) {
      opts.locals = util._extend(opts.locals, metalsmith.metadata())
    }

    Object.keys(files).forEach(function (file) {
      debug('checking file: %s', file)

      if (!/\.jade/.test(path.extname(file))) {
        return
      }

      var data = files[file]
      var dir = path.dirname(file)
      var name = path.basename(file, path.extname(file))
      var fileLocals = {}

      // do we need to add an extension?
      if (path.extname(name) === '') {
        name = path.basename(file, path.extname(file)) + '.html'
      }

      if (dir !== '.') {
        name = dir + '/' + name
      }

      debug('converting file: %s', file)

      opts.filename = path.join(metalsmith.source(), file)

      // also use the file's own data
      if (opts.useMetadata) {
        fileLocals = util._extend(util._extend({}, opts.locals), data)
      }

      // assign filters
      if (opts.filters) {
        Object.keys(opts.filters).forEach(function (filter) {
          jade.filters[filter] = opts.filters[filter]
        })
      }

      // render
      var str = jade.compile(data.contents.toString(), opts)(fileLocals)

      // convert to a buffer
      data.contents = new Buffer(str)

      // remove from global files object
      delete files[file]

      // assign the newly created file
      files[name] = data
    })
  }
}
