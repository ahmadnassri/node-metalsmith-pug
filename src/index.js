import pug from 'pug'
import path from 'path'

export default function ({ locals = {}, filters = {}, useMetadata = false } = {}) {
  const opts = arguments[0] || {}

  return (files, metalsmith, done) => {
    setImmediate(done)

    // extend with metalsmith global metadata
    if (useMetadata) {
      locals = Object.assign(locals, metalsmith.metadata())
    }

    Object.keys(files).forEach(function (file) {
      if (!/\.(pug|jade)/.test(path.extname(file))) {
        return
      }

      let data = files[file]
      let dir = path.dirname(file)
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
      if (filters) {
        Object.keys(filters).forEach(filter => (pug.filters[filter] = filters[filter]))
      }

      const options = Object.assign(opts, {
        filename,
        locals
      })

      // render
      let str = pug.compile(data.contents.toString(), options)(locals)

      // convert to a buffer
      data.contents = new Buffer(str)

      // remove from global files object
      delete files[file]

      // assign the newly created file
      files[name] = data
    })
  }
}
