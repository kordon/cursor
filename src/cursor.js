var type = require('type-component'),
    stream = require('stream')

var cursor = function (callback) {
  this.stream = new stream()
  
  this.stream.writable = true
  this.stream.readable = true
  
  this.closed = false
  this.ended = false
  
  this.stream.resume = this.emit('pause')
  this.stream.pause = this.emit('pause')
  this.stream.destroy = this.destroy.bind(this)
  this.stream.close = this.close.bind(this)
  this.stream.error = this.error.bind(this)
  this.stream.end = this.end.bind(this)
  
  this.callback = callback
}

cursor.prototype.finish = function (e) {
  if(this.ended) return
  this.ended = true
  this.callback(e, this.data)
}

cursor.prototype.emit = function (e) {
  return function () {
    this.stream.emit(e)
  }.bind(this)
}

cursor.prototype.close = function (e) {
  if(this.closed) return
  
  this.stream.writable = false
  this.stream.readable = false
  
  this.stream.emit('close')
  this.finish()
}

cursor.prototype.end = function () {
  this.stream.emit('end')
  this.finish()
  this.close()
}

cursor.prototype.error = function (e) {
  this.stream.emit('error', e)
  this.finish(e, null)
  this.close()
}

cursor.prototype.destroy = function () {
  this.finish()
  this.close()
}

cursor.prototype.isReadStream = function (data) {
  return type(data) == 'object' && data.key && data.value
}

cursor.prototype.flat = function (data) {
  var returns = {}
  returns[data.key] = data.value
  return returns
}

/******************************************************************************/

exports.each = function (each, end) {
  var base = new cursor(end)
    
  base.stream.write = function (data) {
    base.stream.emit('data', data)
    
    if(!base.isReadStream(data)) return each(data)
    each(base.flat(data))
  }
  
  return base.stream
}

exports.all = function (callback) {
  var base = new cursor(callback)
  var isReadStream

  base.stream.write = function (data) {
    base.stream.emit('data', data)
    if(type(isReadStream) == 'undefined') isReadStream = base.isReadStream(data)
    
    if(isReadStream) {
      if(!base.data) base.data = {}
      base.data[data.key] = data.value
    } else {
      if(!base.data) base.data = []
      base.data.push(data)
    }
  }
  
  return base.stream
}