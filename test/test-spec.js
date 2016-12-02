var transform = require('../index.js').transform;

describe('export-from-ie8', function () {
  it('Object.defineProperty -> exports = ', function () {
    expect(transform('Object.defineProperty(exports, "foo", { \
      enumerable: true, \
      get: function get() { \
        return _baz.foo; \
      } \
    });'))
      .toEqual('exports.foo = _baz.foo;');
  });
});