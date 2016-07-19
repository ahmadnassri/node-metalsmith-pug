/* global afterEach, describe, it */
'use strict'

var fs = require('fs')
var pug = require('..')
var Metalsmith = require('metalsmith')
var rimraf = require('rimraf')
var should = require('should')

afterEach(function (done) {
  rimraf('test/*/build', done)
})

describe('metalsmith-pug', function () {
  it('should render html', function (done) {
    var smith = new Metalsmith('test/main')

    smith.use(pug())

    smith.build(function (err) {
      should.not.exist(err)

      fs.exists('test/main/build/index.html', function (exists) {
        exists.should.be.true

        done()
      })
    })
  })

  it('should render files within directories', function (done) {
    var smith = new Metalsmith('test/main')

    smith.use(pug())

    smith.build(function (err) {
      should.not.exist(err)

      fs.exists('test/main/build/dir/test.html', function (exists) {
        exists.should.be.true

        done()
      })
    })
  })

  it('should render html with locals', function (done) {
    var smith = new Metalsmith('test/main')

    smith.use(pug({
      locals: {
        title: 'Foo'
      }
    }))

    smith.build(function (err) {
      should.not.exist(err)

      fs.readFile('test/main/build/locals.html', function (err, data) {
        should.not.exist(err)
        data.toString().should.equal('<h1>Foo</h1>')
        done()
      })
    })
  })

  it('should use Metalsmith.metadata()', function (done) {
    var smith = new Metalsmith('test/main')

    smith.metadata({
      foo: 'bar'
    })

    smith.use(pug({
      useMetadata: true
    }))

    smith.build(function (err) {
      should.not.exist(err)

      fs.readFile('test/main/build/metadata.html', function (err, data) {
        should.not.exist(err)
        data.toString().should.equal('<h1>bar</h1>')

        done()
      })
    })
  })

  it('should use extension prefix as extension', function (done) {
    var smith = new Metalsmith('test/main')

    smith.use(pug({
      locals: {
        foo: 'bar'
      }
    }))

    smith.build(function (err) {
      should.not.exist(err)

      fs.exists('test/main/build/text.txt', function (exists) {
        exists.should.be.true

        fs.readFile('test/main/build/text.txt', function (err, data) {
          should.not.exist(err)
          data.toString().should.equal('bar')

          done()
        })
      })
    })
  })

  it('should not run on none .pug files', function (done) {
    var smith = new Metalsmith('test/main')

    smith.use(pug())

    smith.build(function (err) {
      should.not.exist(err)

      fs.exists('test/main/file.html', function (exists) {
        exists.should.be.false

        done()
      })
    })
  })

  it('should register pug filters', function (done) {
    var smith = new Metalsmith('test/filters')

    smith.use(pug({
      filters: {
        foo: function (block) {
          return block
        }
      }
    }))

    smith.build(function (err) {
      should.not.exist(err)

      fs.readFile('test/filters/build/test.html', function (err, data) {
        should.not.exist(err)
        data.toString().should.equal('bar')

        done()
      })
    })
  })
})
