var through = require('through2'),
    is = require('./is')

var noop = function () {}

module.exports = function (end) {
  if(!is.fn(end)) end = noop
  var isReadStream = null
  var values = []
  var data = {}
  var keys = []

  return through({
    objectMode: true
  }, function (row, enc, callback) {
    if(isReadStream === null) {
      isReadStream = is.readStream(row)
    }

    if(!isReadStream) {
      values.push(row)
      this.push(row)
      return callback()
    }

    data[row.key] = row.value
    values.push(row.value)
    keys.push(row.key)

    this.push(row)
    callback()
  }, function () {
    this.emit('end')
    if(!isReadStream) return end(values)
    end(keys, values, data)
  })
}