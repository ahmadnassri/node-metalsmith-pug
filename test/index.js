const { exists, readFile } = require('node:fs')
const { join } = require('node:path')

const Metalsmith = require('metalsmith')
const rimraf = require('rimraf')
const { test, afterEach } = require('tap')

const pug = require('../src')

const fixtures = join(__dirname, '/fixtures')

afterEach(() => rimraf(fixtures + '/*/build', () => {}))

test('should render html', (assert) => {
  assert.plan(2)

  const smith = new Metalsmith('test/fixtures/main')

  smith.use(pug())

  smith.build((err) => {
    assert.equal(err, null)
    exists(join(fixtures, 'main/build/index.html'), (exists) => assert.ok(exists))
  })
})

test('should support .jade files', (assert) => {
  assert.plan(2)

  const smith = new Metalsmith('test/fixtures/main')

  smith.use(pug())

  smith.build((err) => {
    assert.equal(err, null)

    exists('test/fixtures/main/build/legacy.html', (exists) => assert.ok(exists))
  })
})

test('should pass options to pug', (assert) => {
  assert.plan(3)

  const smith = new Metalsmith('test/fixtures/main')

  smith.use(pug({ pretty: true }))

  smith.build((err) => {
    assert.equal(err, null)

    readFile('test/fixtures/main/build/pretty.html', (err, data) => {
      assert.equal(err, null)
      assert.equal(data.toString(), '\n<div>\n  <h1>Hello</h1>\n</div>')
    })
  })
})

test('should render files within directories', (assert) => {
  assert.plan(2)

  const smith = new Metalsmith('test/fixtures/main')

  smith.use(pug())

  smith.build((err) => {
    assert.equal(err, null)

    exists('test/fixtures/main/build/dir/test.html', (exists) => assert.ok(exists))
  })
})

test('should render html with locals', (assert) => {
  assert.plan(3)

  const smith = new Metalsmith('test/fixtures/main')
  const locals = {
    title: 'Foo'
  }

  smith.use(pug({ locals }))

  smith.build((err) => {
    assert.equal(err, null)

    readFile('test/fixtures/main/build/locals.html', (err, data) => {
      assert.equal(err, null)
      assert.equal(data.toString(), '<h1>Foo</h1>')
    })
  })
})

test('should use Metalsmith.metadata()', (assert) => {
  assert.plan(3)

  const smith = new Metalsmith('test/fixtures/main')

  smith.metadata({ foo: 'bar' })
  smith.use(pug({ useMetadata: true }))

  smith.build((err) => {
    assert.equal(err, null)

    readFile('test/fixtures/main/build/metadata.html', (err, data) => {
      assert.equal(err, null)
      assert.equal(data.toString(), '<h1>bar</h1>')
    })
  })
})

test('should use extension prefix as extension', (assert) => {
  assert.plan(4)

  const smith = new Metalsmith('test/fixtures/main')
  const locals = {
    foo: 'bar'
  }

  smith.use(pug({ locals }))

  smith.build((err) => {
    assert.equal(err, null)

    exists('test/fixtures/main/build/text.txt', (exists) => {
      assert.ok(exists)

      readFile('test/fixtures/main/build/text.txt', (err, data) => {
        assert.equal(err, null)
        assert.equal(data.toString(), 'bar')
      })
    })
  })
})

test('should not run on none .pug files', (assert) => {
  assert.plan(2)

  const smith = new Metalsmith('test/fixtures/main')

  smith.use(pug())

  smith.build((err) => {
    assert.equal(err, null)

    exists('test/fixtures/main/file.html', (exists) => assert.notOk(exists))
  })
})

test('should register pug filters', (assert) => {
  assert.plan(3)

  const smith = new Metalsmith('test/fixtures/filters')

  smith.use(pug({
    filters: { foo: block => block }
  }))

  smith.build((err) => {
    assert.equal(err, null)

    readFile('test/fixtures/filters/build/test.html', (err, data) => {
      assert.equal(err, null)
      assert.equal(data.toString(), 'bar')
    })
  })
})
