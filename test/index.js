import fs from 'fs'
import Metalsmith from 'metalsmith'
import pug from '../src'
import rimraf from 'rimraf'
import { test } from 'tap'

test('metalsmith-jade', (tap) => {
  tap.plan(10)

  tap.afterEach((done) => rimraf('test/fixtures/*/build', done))

  tap.test('should render html', (assert) => {
    assert.plan(2)

    let smith = new Metalsmith('test/fixtures/main')

    smith.use(pug())

    smith.build((err) => {
      assert.equal(err, null)

      fs.exists('test/fixtures/main/build/index.html', (exists) => assert.ok(exists))
    })
  })

  tap.test('should support .jade files', (assert) => {
    assert.plan(2)

    let smith = new Metalsmith('test/fixtures/main')

    smith.use(pug())

    smith.build((err) => {
      assert.equal(err, null)

      fs.exists('test/fixtures/main/build/legacy.html', (exists) => assert.ok(exists))
    })
  })

  tap.test('should pass options to pug', (assert) => {
    assert.plan(3)

    let smith = new Metalsmith('test/fixtures/main')

    smith.use(pug({ pretty: true }))

    smith.build((err) => {
      assert.equal(err, null)

      fs.readFile('test/fixtures/main/build/pretty.html', (err, data) => {
        assert.equal(err, null)
        assert.equal(data.toString(), '\n<div>\n  <h1>Hello</h1>\n</div>')
      })
    })
  })

  tap.test('should render files within directories', (assert) => {
    assert.plan(2)

    let smith = new Metalsmith('test/fixtures/main')

    smith.use(pug())

    smith.build((err) => {
      assert.equal(err, null)

      fs.exists('test/fixtures/main/build/dir/test.html', (exists) => assert.ok(exists))
    })
  })

  tap.test('should render html with locals', (assert) => {
    assert.plan(3)

    let smith = new Metalsmith('test/fixtures/main')
    let locals = {
      title: 'Foo'
    }

    smith.use(pug({ locals }))

    smith.build((err) => {
      assert.equal(err, null)

      fs.readFile('test/fixtures/main/build/locals.html', (err, data) => {
        assert.equal(err, null)
        assert.equal(data.toString(), '<h1>Foo</h1>')
      })
    })
  })

  tap.test('should use Metalsmith.metadata()', (assert) => {
    assert.plan(3)

    let smith = new Metalsmith('test/fixtures/main')

    smith.metadata({ foo: 'bar' })
    smith.use(pug({ useMetadata: true }))

    smith.build((err) => {
      assert.equal(err, null)

      fs.readFile('test/fixtures/main/build/metadata.html', (err, data) => {
        assert.equal(err, null)
        assert.equal(data.toString(), '<h1>bar</h1>')
      })
    })
  })

  tap.test('should use extension prefix as extension', (assert) => {
    assert.plan(4)

    let smith = new Metalsmith('test/fixtures/main')
    let locals = {
      foo: 'bar'
    }

    smith.use(pug({ locals }))

    smith.build((err) => {
      assert.equal(err, null)

      fs.exists('test/fixtures/main/build/text.txt', (exists) => {
        assert.ok(exists)

        fs.readFile('test/fixtures/main/build/text.txt', (err, data) => {
          assert.equal(err, null)
          assert.equal(data.toString(), 'bar')
        })
      })
    })
  })

  tap.test('should not run on none .pug files', (assert) => {
    assert.plan(2)

    let smith = new Metalsmith('test/fixtures/main')

    smith.use(pug())

    smith.build((err) => {
      assert.equal(err, null)

      fs.exists('test/fixtures/main/file.html', (exists) => assert.notOk(exists))
    })
  })

  tap.test('should register pug filters', (assert) => {
    assert.plan(3)

    let smith = new Metalsmith('test/fixtures/filters')

    smith.use(pug({
      filters: { foo: block => block }
    }))

    smith.build((err) => {
      assert.equal(err, null)

      fs.readFile('test/fixtures/filters/build/test.html', (err, data) => {
        assert.equal(err, null)
        assert.equal(data.toString(), 'bar')
      })
    })
  })

  tap.test('should catch thrown errors', (assert) => {
    let smith = new Metalsmith('test/fixtures/should-throw')

    smith.use(pug())

    smith.build((err) => {
      assert.ok(err)
      assert.end()
    })
  })
})
