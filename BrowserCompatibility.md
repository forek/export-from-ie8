# 浏览器兼容解决方案
  本文内容：

    1. wepack、react、react-router、react-redux 环境下各浏览器兼容问题解决方案。
    2. 示例代码仅供参考, 具体代码请按照实际情况编写, 切勿复制粘贴!
# Chapter - 1: IE8
## Problem - 1: React 高版本不支持IE8
解决方案: 
  * `react` 版本降级
```json
  "dependencies": {
      "react": "=0.14.0",
      "react-addons-test-utils": "=0.14.0",
      "react-dom": "=0.14.0",
  }
```

## Problem - 2: IE8环境下缺失api
解决方案: 
  * 添加静态文件`es5-shim.min.js`与`es5-sham.min.js`到项目中
  * view 引入`es5-shim`与`es5-sham`
```html
  <!--[if lt IE 9]> 
    <script src="/static/es5-shim.min.js"></script>
    <script src="/static/es5-sham.min.js"></script>
  <![endif]--> 
```
  * 使用 `transform-runtime`
```javascript
  {
      ...
    loader: 'babel',
    query: {
      ...
      plugins: [
        ['transform-runtime', {
          "polyfill": true,
          "regenerator": true
        }]
      ]
    }
      ...
  }
```
## Problem - 3: 保留字做key报错
解决方案: 
  * 使用 `es3ify`
  * 修改项目中错误使用的保留字
```javascript
  postLoaders: [
    {
      test: /\.(js|jsx)$/,
      loaders: ['es3ify-loader']
    }
  ]
```
  * 注意：假如项目中同时使用了 `webpack.optimize.UglifyJsPlugin`，那么它会使`es3ify`所做的转换失效（无论在何时使用`es3ify-loader`）。即使在 `UglifyJsPlugin` 配置中加入 `{ compress: { properties: false } }` 也不能达到理想效果。
  * 此时应使用 `es3ify-webpack-plugin`
```javascript
  var es3ifyPlugin = require('es3ify-webpack-plugin');
```
  * 并将其添加到 `new webpack.optimize.UglifyJsPlugin()` 之后
```javascript
  {
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new es3ifyPlugin()
    ]
  }
```
## Problem - 4: react-router 等组件 defineProperty 报错
解决方案: 
  * 使用 `export-from-ie8`
```javascript
  postLoaders: [
    {
      test: /\.(js|jsx)$/,
      loaders: ['export-from-ie8/loader']
    }
  ]
```

## Problem - 5: 热更新模块出错 或 提示`eslint... style[key]`参数不正确
解决方案: 
  * ie8环境开发时去掉热更新模块

## Problem - 6: fetch请求发不出去
解决方案: 
  * 使用`es6-promise`与`fetch-ie8`
```javascript
  import 'es6-promise';
  import 'fetch-ie8';
```

## Problem - 7: react-router 无法正常工作
解决方案: 
  * IE9及以下版本浏览器使用 `hashHistory`
```javascript
  import { Router, hashHistory } from 'react-router';

  <Router history={hashHistory}>
    { ... }
  </Router>
```
  * 针对 `hashHistory` 在node服务器端做重定向
```javascript
  // Hash Routes Redirect
  app.use((req, res, next) => {
    if (req.url === '/') return next();
    const browser = getBrowser(req);
    const shouldHashRedirect = browser.info.browser === 'IE' &&
      browser.info.system.match(/(9|8|7)\.0/);
    if (shouldHashRedirect) {
      const routes = require('../app/routes/index').default();
      match({
        routes,
        location: req.url
      }, (err, redirectLocation, renderProps) => {
        if (!err && !redirectLocation && renderProps) {
          res.redirect(`/#${req.url}`);
        } else {
          next();
        }
      });
    } else {
      next();
    }
  });
```

## Problem - 8: 打开页面白屏
解决方案: 
  * 手动触发 `layout` 重绘页面
```javascript
  // trigger layout
  const InterValId = setInterval(() => {
    document.body.style.cssText = 'display: block;';
  }, 500);

  setTimeout(() => {
    clearInterval(InterValId);
  }, 1000 * 5);
```

## Problem - 9: 部分包使用`addEventListener`报错
解决方案: 
  * 请换一个包谢谢 :)

## Problem - 10: 生产环境使用`UglifyJsPlugin`压缩代码报错
解决方案:
  * 尝试使用兼容IE配置
```javascript
  {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        output: {
          screw_ie8: false
        }
      })
    ]
  }
```

## Others: 使用`loose模式`和`es2015-modules-commonjs`
  * 以提高浏览器兼容性
```javascript
  {
      ...
    loader: 'babel',
    query: {
      presets: ['es2015-loose', ... ],
      ...
      plugins: [
        ['transform-es2015-modules-commonjs']
      ]
    }
      ...
  }
```

# Chapter - 2: 360浏览器
## Problem - 1: 如何默认使用高速模式
  * 添加 `meta` 标签:
```html
<meta name="renderer" content="webkit" />
```
