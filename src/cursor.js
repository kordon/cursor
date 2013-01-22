var each = require('./each'),
    all = require('./all')

module.exports = function (stream) {
  return new cursor(stream)
}

var each = module.exports.each = require('./each')
var all = module.exports.all = require('./all')

var cursor = function (stream) {
  this.stream = stream
}

cursor.prototype.all = function (end) {
  this.stream.on('error', end)
  this.stream.pipe(all(function () {
    Array.prototype.unshift.call(arguments, null)
    end.apply(end, arguments)
  }))
  
  return this.stream
}

cursor.prototype.each = function (start, end) {
  this.stream.on('error', end)
  this.stream.pipe(each(start, function () {
    Array.prototype.unshift.call(arguments, null)
    end.apply(end, arguments)
  }))
  
  return this.stream
}