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
  
### Register a jade filter

Since metalsmith-jade uses the jade runtime located at
./node_modules/metalsmith-jade/node_modules/jade and not the project specific
one at ./node_modules/jade it is not possible to register filters on jade directly.
Therefore the regiserFilter method was introduced. The
method accepts the name of a filter and a filter factory method. The filter
factory method is passed the jade lang (require('jade')) the jade runtime
(require('jade/lib/runtime')) and the jade filters (require('jade/lib/filters'))
and should return a method which will be registered as a jade filter using the
name passed as the first argument to the registerFilter method.

#### Example

```
var jade = require('metalsmith-jade');

jade.registerFilter('sample', function(jade_lang, jade_runtime, jade_filters) {
  return function(text) {
    // e.g. convert jade markup to html
    var html = jade_lang.render(text, options);

    // e.g. apply some other jade filter
    var filtered = jade_filters('fooFilter', text);

    // return the markup to be placed at the filter invocations position
    return "foobar";
  }  
});
```

## Thanks

  This library is a cheap copy of [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown). Thank you @ianstormtaylor for doing the actual work.
  
## License

  MIT (c) 2014 Max Bareiss