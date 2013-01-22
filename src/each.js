var through = require('through'),
    is = require('./is')

var noop = function () {}

module.exports = function (each, end) {
  if(!is.fn(each)) each = noop
  if(!is.fn(end)) end = noop
  var isReadStream = null

  return through(function (row) {
    this.emit('data', row)
    if(isReadStream === null) isReadStream = is.readStream(row)
    if(!isReadStream) return each(row)
    var data = {}
    data[row.key] = row.value
    each(row.key, row.value, data)
  }, function () {
    this.emit('end')
    end()
  })
}