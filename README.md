# export-from-ie8
solution to the problem: https://github.com/babel/babel/issues/4265

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
