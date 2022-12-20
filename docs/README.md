
## Install

```bash
npm install metalsmith-pug
```

## Usage

I recommend using an optimized build matching your Node.js environment version, otherwise, the standard `require` would work just fine with any version of Node `>= v4.0` .

```js
/*
 * Node 7
 */
const metalsmith-jade = require('metalsmith-jade/lib/node7')

/*
 * Node 6
 */
const metalsmith-jade = require('metalsmith-jade/lib/node6')

/*
 * Node 4 (Default)
 * Note: additional ES2015 polyfills may be required
 */
var metalsmith-jade = require('metalsmith-jade')
```

## API

Pass `options` to the pug plugin and pass it to Metalsmith with the `use` method:

```js
import Metalsmith from 'metalsmith'
import pug from 'metalsmith-pug'

const options = {
  pretty: false,

  locals: {
    postName: 'good post name'
  },

  filters: {
    foo: block => block.replace('foo', 'bar')
  }
}

new Metalsmith(__dirname)
  .use(pug(options))
```

## CLI

You can also use the plugin with the Metalsmith CLI by adding a key to your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-pug": {
      "pretty": false
    }
  }
}
```

All options are passed directly to pug. If `options` has a `locals` key, that will be passed along to pug.

## Options

any of the `options` parameters for [`pug`](http://jade-lang.com/api/) with the additional plugin specific properties below:

| Name              | Type      | Required | Default | Details                                                 |
| ----------------- | --------- | -------- | ------- | ------------------------------------------------------- |
| **`useMetadata`** | `Boolean` | ❌       | `false` | Expose Metalsmith's global metadata to the pug template |
| **`locals`**      | `Object`  | ❌       | `{}`    | Pass additional locals to the template                  |
| **`filters`**     | `Object`  | ❌       | `{}`    | register functions to be used as template filters       |
