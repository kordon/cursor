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
  var called = false

  this.stream.on('error', function () {
    if (called) return
    called = true

    end.apply(end, arguments)
  })

  this.stream.pipe(all(function () {
    if (called) return
    called = true

    Array.prototype.unshift.call(arguments, null)
    end.apply(end, arguments)
  }))

  return this.stream
}

cursor.prototype.each = function (start, end) {
  var called = false

  this.stream.on('error', function () {
    if (called) return
    called = true

    end.apply(end, arguments)
  })

  this.stream.pipe(each(start, function () {
    if (called) return
    called = true

    Array.prototype.unshift.call(arguments, null)
    end.apply(end, arguments)
  }))

  return this.stream
}