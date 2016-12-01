var transform = require('./index').transform;

module.exports = function(code) {
  this.cacheable();
  return transform(code);
};