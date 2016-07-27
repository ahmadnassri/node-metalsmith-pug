# Metalsmith Pug [![version][npm-version]][npm-url] [![License][npm-license]][license-url]

[Metalsmith](http://www.metalsmith.io/) plugin to convert [pug](https://github.com/pugjs/pug) files.

[![Build Status][travis-image]][travis-url]
[![Downloads][npm-downloads]][npm-url]
[![Code Climate][codeclimate-quality]][codeclimate-url]
[![Coverage Status][codeclimate-coverage]][codeclimate-url]
[![Dependencies][david-image]][david-url]

## Install

```sh
npm install --production --save metalsmith-pug
```

## Usage

I reccomend using an optimized build matching your Node.js environment version, otherwise, the standard `require` would work just fine.

```js
/*
 * Node 6
 * Built using `babel-preset-es2015-node6`
 */
const pug = require('metalsmith-pug/lib/node6')

/*
 * Node 5
 * Built using `babel-preset-es2015-node5`
 */
const pug = require('metalsmith-pug/lib/node5')

/*
 * Node 4
 * Built using `babel-preset-es2015-node4`
 */
const pug = require('metalsmith-pug/lib/node4')

/*
 * Node >=0.10 <=0.12
 * Built using `babel-preset-es2015`
 */
var pug = require('metalsmith-pug')
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

## Options:

any of the `options` parameters for [`pug`](http://jade-lang.com/api/) with the additional plugin specific properties below:


| Name              | Type      | Required | Default | Details                                                 |
| ----------------- | --------- | -------- | ------- | ------------------------------------------------------- |
| **`useMetadata`** | `Boolean` | `✖`     | `false` | Expose Metalsmith's global metadata to the pug template |
| **`locals`**      | `Object`  | `✖`     | `{}`    | Pass additional locals to the template                  |
| **`filters`**     | `Object`  | `✖`     | `{}`    | register functions to be used as template filters       |

----
> :copyright: [www.ahmadnassri.com](https://www.ahmadnassri.com/) &nbsp;&middot;&nbsp;
> License: [ISC](LICENSE) &nbsp;&middot;&nbsp;
> Github: [@ahmadnassri](https://github.com/ahmadnassri) &nbsp;&middot;&nbsp;
> Twitter: [@ahmadnassri](https://twitter.com/ahmadnassri)

[license-url]: http://choosealicense.com/licenses/isc/

[travis-url]: https://travis-ci.org/ahmadnassri/metalsmith-pug
[travis-image]: https://img.shields.io/travis/ahmadnassri/metalsmith-pug.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/metalsmith-pug
[npm-license]: https://img.shields.io/npm/l/metalsmith-pug.svg?style=flat-square
[npm-version]: https://img.shields.io/npm/v/metalsmith-pug.svg?style=flat-square
[npm-downloads]: https://img.shields.io/npm/dm/metalsmith-pug.svg?style=flat-square

[codeclimate-url]: https://codeclimate.com/github/ahmadnassri/metalsmith-pug
[codeclimate-quality]: https://img.shields.io/codeclimate/github/ahmadnassri/metalsmith-pug.svg?style=flat-square
[codeclimate-coverage]: https://img.shields.io/codeclimate/coverage/github/ahmadnassri/metalsmith-pug.svg?style=flat-square

[david-url]: https://david-dm.org/ahmadnassri/metalsmith-pug
[david-image]: https://img.shields.io/david/ahmadnassri/metalsmith-pug.svg?style=flat-square
