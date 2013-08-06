var assert = require('chai').assert,
    level = require('level'),
    crypto = require('crypto'),
    stream = require('stream'),
    path = require('path')

// path for the dbs directory
var dbs = path.join(path.dirname(__filename), 'dbs')

// generate a hash from the current unix timestamp
var hash = function () {
  var timestamp = new Date().getTime().toString()
  return crypto.createHash('md5').update(timestamp, 'utf8').digest('hex')
}

module.exports.noop = function () {}

// create and return a new level instance
module.exports.db = function () {
  return level(path.join(dbs, hash()), {
    createIfMissing: true,
    errorIfExists: false
  })
}

// fill the database with data
module.exports.fill = function (db, data, callback) {
  db.batch(data, function (e) {
    assert.equal(e,  null)
    callback()
  })
}

// handle an error event
module.exports.onerror = function (e) {
  assert.equal(e,  null)
}

module.exports.readable = function () {
  var s = new stream()
  var times = 0
  
  s.readable = true
  
  var iv = setInterval(function () {
    s.emit('data', times + '\n')
    if(++times === 1) {
      s.emit('error', new Error())
      clearInterval(iv)
    }
  }, 100)
  
  return s
}

// require the data
module.exports.values = require('./data/values.json')
module.exports.data = require('./data/data.json')
module.exports.keys = require('./data/keys.json')
module.exports.kv = require('./data/kv.json')