
/**
 * Expose `render()`.`
 */

exports = module.exports = render;

/**
 * Expose `compile()`.
 */

exports.compile = compile;

/**
 * Render the given mustache `str` with `obj`.
 *
 * @param {String} str
 * @param {Object} obj
 * @return {String}
 * @api public
 */

function render(str, obj) {
  obj = obj || {};
  var fn = compile(str);
  return fn(obj);
}

/**
 * Compile the given `str` to a `Function`.
 *
 * @param {String} str
 * @return {Function}
 * @api public
 */

function compile(str) {
  var tokens = parse(str);
  var js = [],
      sectionLevel = 0,
      tok;
  js.push('var out = "";');

  function prependComma(val) {
    var jsLast = js[js.length - 1];
    if (!(jsLast[jsLast.length - 1] === '[')) {
      // This is not the first element in the list, so prepend a comma
       val = ', ' + val;
    }
    return val;
  }

  for (var i = 0; i < tokens.length; ++i) {
    tok = tokens[i];
    if (i % 2 == 0) {
      tok = tok.replace(/"/g, '\\"');
      if (tok) {
        var val = '"' + tok + '"';
        if (sectionLevel > 0) {
          js.push(prependComma(val));
        } else {
          js.push('out += ' + val + ';');
        }
      }
    } else {
      switch (tok[0]) {
        case '#':
          tok = tok.slice(1);
          assertProperty(tok);
          var val = 'section(obj, "' + tok + '", false, [';
          if (sectionLevel > 0) {
            js.push(prependComma(val));
          } else {
            js.push('out += ' + val);
          }
          sectionLevel++;
          break;
        case '!':
          tok = tok.slice(1);
          assertProperty(tok);
          var val = 'obj.' + tok;
          if (sectionLevel > 0) {
            js.push(prependComma(val));
          } else {
            js.push('out += ' + val + ';');
          }
          break;
        case '^':
          tok = tok.slice(1);
          assertProperty(tok);
          var val = 'section(obj, "' + tok + '", true, [';
          if (sectionLevel > 0) {
            js.push(prependComma(val));
          } else {
            js.push('out += ' + val);
          }
          sectionLevel++;
          break;
        case '/':
          tok = tok.slice(1);
          if (sectionLevel > 0) {
            js.push('])');
            if (sectionLevel == 1) {
              js.push(';');
            }
          }
          sectionLevel--;
          break;
        default:
          assertProperty(tok);
          if (sectionLevel > 0) {
            // The bracket indicates it's a property that should be looked up
            var val = '"{' + tok + '"';
            js.push(prependComma(val));
          } else {
            js.push('out += escape(obj.' + tok + ');');
          }
      }
    }
  }
  js.push('return out;');

  js = '\n'
    + indent(escape.toString()) + ';\n\n'
    + indent(section.toString()) + ';\n\n'
    + js.join('').replace(/\n/g, '\\n');

  return new Function('obj', js);
}

/**
 * Assert that `prop` is a valid property.
 *
 * @param {String} prop
 * @api private
 */

function assertProperty(prop) {
  if (!prop.match(/^[\w.]+$/)) throw new Error('invalid property "' + prop + '"');
}

/**
 * Parse `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function parse(str) {
  return str.split(/\{\{|\}\}/);
}

/**
 * Indent `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function indent(str) {
  return str.replace(/^/gm, '  ');
}

/**
 * Section handler.
 *
 * @param {Object} context obj
 * @param {String} prop
 * @param {String} str
 * @param {Boolean} negate
 * @api private
 */

function section(obj, prop, negate, tokens) {
  var val = obj[prop];

  function processTokens(ob, toks) {
    var out = '';
    for (var i = 0; i < toks.length; ++i) {
      var tok = toks[i];
      if (tok[0] == '{') {
        out += ob[tok.slice(1)];
      } else {
        out += tok;
      }
    }
    return out;
  }

  if (Array.isArray(val)) {
    var out = '';
    for (var i = 0; i < val.length; ++i) {
      out += processTokens(val[i], tokens);
    }
    return out;
  }
  if ('function' == typeof val) return val.call(obj, tokens.join(''));
  if (negate) val = !val;
  if (val) return processTokens(obj, tokens);
  return '';
}

/**
 * Escape the given `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escape(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
