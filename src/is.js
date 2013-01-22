var type = require('type-component')

module.exports.readStream = function (row) {
  return type(row) == 'object' && row.key && row.value
}

module.exports.fn = function (fn) {
  return type(fn) == 'function'
}