const pug = require('pug')
const path = require('path')

module.exports = function ({ locals = {}, filters = {}, useMetadata = false } = {}) {
  const opts = arguments[0] || {}

  return (files, metalsmith, done) => {
    setImmediate(done)

    // extend with metalsmith global metadata
    if (useMetadata) {
      locals = Object.assign({}, locals, metalsmith.metadata())
    }

    Object.keys(files).forEach((file) => {
      if (!/\.(pug|jade)/.test(path.extname(file))) {
        return
      }

      const data = files[file]
      const dir = path.dirname(file)
      let name = path.basename(file, path.extname(file))

      // do we need to add an extension?
      if (path.extname(name) === '') {
        name = path.basename(file, path.extname(file)) + '.html'
      }

      if (dir !== '.') {
        name = `${dir}/${name}`
      }

      const filename = path.join(metalsmith.source(), file)

      // also use the file's own data
      if (useMetadata) {
        locals = Object.assign(locals, data)
      }

      // assign filters
      /* istanbul ignore else */
      if (filters) {
        Object.keys(filters).forEach((filter) => (pug.filters[filter] = filters[filter]))
      }

      const options = Object.assign(opts, {
        filename,
        locals
      })

      // render
      const str = pug.compile(data.contents.toString(), options)(locals)

      // convert to a buffer
      data.contents = Buffer.from(str)

      // remove from global files object
      delete files[file]

      // assign the newly created file
      files[name] = data
    })
  }
}
