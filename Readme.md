# metalsmith-jade

  A Metalsmith plugin to convert jade files.

## Installation

    $ npm install metalsmith-jade

## CLI Usage

  Install via npm and then add the `metalsmith-jade` key to your `metalsmith.json` plugins. All options are passed directly to jade. If `options` has a `locals` key, that will be passed along to jade. This is the first step in my quest to make a system that ACTUALLY MAKES IT EASY to develop a website in jade, build it, and put it on static hosting (like one would find in a univeristy). WHY IS THIS SO HARD! (I'm not angry or anything...)

```json
{
  "plugins": {
    "metalsmith-jade": {
        "pretty":false
    }
  }
}
```

## Javascript Usage

  Pass `options` to the jade plugin and pass it to Metalsmith with the `use` method:
  
```
var jade = require('metalsmith-jade');

metalsmith.use(jade({
  "pretty":false,
  "locals":{
    "postName":"Totally a good post name"
  }
}));
```
  
## Thanks

  This library is a cheap copy of [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown). Thank you @ianstormtaylor for doing the actual work.
  
## License

  MIT (c) 2014 Max Bareiss