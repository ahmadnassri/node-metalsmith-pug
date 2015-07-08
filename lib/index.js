'use strict'

var debug = require('debug-log')('metalsmith-jade')
var extend = require('xtend')
var jade = require('jade')
var path = require('path')

module.exports = function (options) {
  var opts = options || {}
  opts.locals = opts.locals || {}
  opts.filters = opts.filters || {}

  return function (files, metalsmith, done) {
    setImmediate(done)

    // extend with metalsmith global metadata
    if (opts.useMetadata) {
      opts.locals = extend(opts.locals, metalsmith.metadata())
    }

    Object.keys(files).forEach(function (file) {
      debug('checking file: %s', file)

      if (!/\.jade/.test(path.extname(file))) {
        return
      }

      var locals = opts.locals
      var data = files[file]
      var dir = path.dirname(file)
      var name = path.basename(file, path.extname(file))

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
        locals = extend(opts.locals, data)
      }

      debug('locals: %j', locals)

      // assign filters
      if (opts.filters) {
        Object.keys(opts.filters).forEach(function (filter) {
          jade.filters[filter] = opts.filters[filter]
        })
      }

      // render
      var str = jade.compile(data.contents.toString(), opts)(locals)

      // convert to a buffer
      data.contents = new Buffer(str)

      // remove from global files object
      delete files[file]

      // assign the newly created file
      files[name] = data
    })
  }
}
