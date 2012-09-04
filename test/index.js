
/**
 * Module dependencies.
 */

var mm = require('..');

describe('{{id}}', function(){
  it('should buffer', function(){
    var user = { name: 'tobi' };
    mm('hi {{name}}.', user).should.equal('hi tobi.');
  })

  it('should escape', function(){
    var user = { name: '<script>' };
    mm('hi {{name}}.', user).should.equal('hi &lt;script&gt;.');
  })

  it('should support nested props', function(){
    var user = { name: { first: 'tobi', last: 'ferret' }};
    mm('hi {{name.first}} {{name.last}}.', user).should.equal('hi tobi ferret.');
  })

  it.only('should escape newlines', function(){
    var user = { name: 'tobi' };
    mm('hi,\nhow are you {{name}}?', user).should.equal('hi,\nhow are you tobi?');
  })

  it('should only match words', function(done){
    try {
      mm('hi {{name)}}.');
    } catch (err) {
      err.message.should.equal('invalid property "name)"');
      done();
    }
  })
})
