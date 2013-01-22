var through = require('through'),
    is = require('./is')
    
var noop = function () {}

module.exports = function (end) {
  if(!is.fn(end)) end = noop
  var isReadStream = null
  var values = []
  var data = {}
  var keys = []

  return through(function (row) {
    this.emit('data', row)
    if(isReadStream === null) isReadStream = is.readStream(row)
    if(!isReadStream) return values.push(row)
    data[row.key] = row.value
    values.push(row.value)
    keys.push(row.key)
  }, function () {
    this.emit('end')
    if(!isReadStream) return end(values)
    end(keys, values, data)
  })
}