
/**
 * Module dependencies.
 */

var mm = require('..');

describe('{{id}}', function(){
  it('should buffer', function(){
    var user = { name: 'tobi' };
    mm('hi {{name}}', user).should.equal('hi tobi');
  })
})