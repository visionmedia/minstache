
# minstache

  Mini mustache template engine.

## Installation

    $ npm install minstache
    $ component install visionmedia/minstache

## minstache(1)

  The `minstache(1)` executable can compile a file to a valid 
  stand-alone commonjs module for you, there's no need to have minstache
  as a dependency:

  hello.mustache:

```
Hello {{name}}! {{^authenticated}}<a href="/login">login</a>{{/authenticated}}
```

  or the following is valid:

```
Hello {name}! {^authenticated}<a href="/login">login</a>{/authenticated}
```

  convert it:

```
$ minstache < hello.mustache > hello.js
```

  hello.js:

```js
module.exports = function anonymous(obj) {

  function escape(html) {
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  function section(obj, prop, negate, str) {
    var val = obj[prop];
    if ('function' == typeof val) return val.call(obj, str);
    if (negate) val = !val;
    if (val) return str;
    return '';
  };

  return "Hello " + escape(obj.name) + "! " + section(obj, "authenticated", true, "<a href=\"/login\">login</a>") + "\n"
}
```

## API

### minstache(string, [obj])

  Compile and render the given mustache `string` with optional context `obj`.

### minstache.compile(string)

  Compile the mustache `string` to a stand-alone `Function` accepting a context `obj`.

## Divergence

  Minstache also allows `{` as an alias of `{{` to reduce the noise.

  Partials are not supported, this lib is meant to be a small template engine solution for stand-alone [component](http://github.com/component) templates. If your template takes "partials" then pass other rendered strings to it. If you need a full-blown mustache solution Hogan.js is still great.

## License 

(The MIT License)

Copyright (c) 2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.