
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

function compile(str) {
  var js = [];
  var toks = parse(str);

  for (var i = 0; i < toks.length; ++i) {
    if (i % 2 == 0) {
      js.push('"' + toks[i] + '"');
    } else {
      js.push(' + obj.' + toks[i] + ' + ');
    }
  }

  js = 'return ' + js.join('');

  return new Function('obj', js);
}

function parse(str) {
  return str.split(/\{\{|\}\}/);
}