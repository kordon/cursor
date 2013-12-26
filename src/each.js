var through = require('through2'),
    is = require('./is')

var noop = function () {}

module.exports = function (each, end) {
  if(!is.fn(each)) each = noop
  if(!is.fn(end)) end = noop
  var isReadStream = null

  return through({
    objectMode: true
  }, function (row, enc, callback) {
    if(isReadStream === null) {
      isReadStream = is.readStream(row)
    }

    if(!isReadStream) {
      each(row)
      this.push(row)
      return callback()
    }

    var data = {}
    data[row.key] = row.value
    each(row.key, row.value, data)

    this.push(row)
    callback()
  }, function () {
    this.emit('end')
    end()
  })
}