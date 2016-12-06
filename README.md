# export-from-ie8
When "export { foo } from './baz';" is used, it is incorrectly compiled by babel as "Object.defineProperty (...)", which causes the IE8 browser to go wrong, like: https://github.com/babel/babel/issues/4265. Using "export-from-ie8" will solve this problem.

### Usage
Add export-from-ie8/loader into webpack.config.js
```
  postLoaders: [
    {
      test: /\.(js|jsx)$/,
      loader: 'export-from-ie8/loader'
    }
  ]
```

### Example
```javascript

// Before

export { foo, bar } from './baz';

// After
exports.bar = _baz.foo;
exports.foo = _baz.foo;
```

### Test
```sh
npm run test
```
