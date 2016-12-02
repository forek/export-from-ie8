var jstransform = require('jstransform');
var through = require('through');
var utils = require('jstransform/src/utils');
var Syntax = jstransform.Syntax;

function visitorExportsDefinePropertyGet(traverse, node, path, state) {
  var exportsStr = [node.expression.arguments[0].name, '.',
    node.expression.arguments[1].value, ' = ',
    node.expression.arguments[2].properties[1].value.body.body[0].argument.object.name, '.',
    node.expression.arguments[2].properties[1].value.body.body[0].argument.property.name].join('');
  utils.append(exportsStr, state);
  utils.catchup(node.expression.range[1], state, function (text) {
    return ''
  });
}

visitorExportsDefinePropertyGet.test = function (node, path, state) {
  try {
    if (node.type === Syntax.ExpressionStatement &&
      node.expression.type === Syntax.CallExpression &&
      node.expression.callee.type === Syntax.MemberExpression &&
      node.expression.callee.object.name === 'Object' &&
      node.expression.callee.property.name === 'defineProperty' &&
      node.expression.arguments[0].name === 'exports' &&
      node.expression.arguments[1].value !== '__esModule' &&
      node.expression.arguments[2].properties.length === 2 &&
      node.expression.arguments[2].properties[0].key.name === 'enumerable' &&
      node.expression.arguments[2].properties[1].key.name === 'get'
    ) {
      return true;
    }
  } catch (error) {
    // catch error;
  }

  return false;
}

var visitorList = [visitorExportsDefinePropertyGet];

function transform(originalCode) {
  return jstransform.transform(visitorList, originalCode).code;
}

function process(file) {
  if (/\.json$/.test(file)) return through();
  var data = '';
  function write(chunk) {
    data += chunk;
  }

  function compile() {

    var source;

    try {
      source = transform(data);
    } catch (e) {
      return this.emit('error', e);
    }

    this.queue(source);
    this.queue(null);
  }

  return through(write, compile);
}

module.exports = process;
module.exports.transform = transform;
module.exports.visitorList = visitorList;