if(process.env['CURSOR_COV']) var cursor = require('../../src-cov/cursor')
else var cursor = require('../../')

var utils = require('../utils'),
    chai = require('chai')

var assert = chai.assert
var expect = chai.expect
var db = utils.db()

before(function (callback) {
  utils.fill(db, utils.data, callback)
})

suite('pipe each')

test('error param', function (callback) {
  var db1 = utils.db()
  var values = []
  var second = {}
  var data1 = {}
  var first = {}
  var data = {}
  var keys = []

  first.each = function (key, value) {
    data[key] = value
  }

  first.end = function (e) {
    assert.equal(e,  null)
    cursor(db1.readStream()).each(second.each, second.end)
  }

  second.each = function (key, value) {
    expect(utils.values).to.include(value)
    expect(utils.keys).to.include(key)
    expect(value).to.equal(data[key])
    data1[key] = value
    values.push(value)
    keys.push(key)
  }

  second.end = function (e) {
    assert.equal(e,  null)
    assert.equal(values.length, utils.values.length)
    assert.equal(keys.length, utils.keys.length)
    expect(data).to.eql(data1)
    callback()
  }

  cursor(db.readStream()).each(first.each, first.end).pipe(db1.writeStream())
})

test('error event', function (callback) {
  var db1 = utils.db()
  var values = []
  var second = {}
  var data1 = {}
  var first = {}
  var data = {}
  var keys = []
  
  first.each = function (key, value) {
    data[key] = value
  }
  
  first.end = function () {
    db1.readStream().on('error', utils.onerror)
       .pipe(cursor.each(second.each, second.end))
  }
  
  second.each = function (key, value) {
    expect(utils.values).to.include(value)
    expect(utils.keys).to.include(key)
    expect(value).to.equal(data[key])
    data1[key] = value
    values.push(value)
    keys.push(key)
  }
  
  second.end = function () {
    expect(values.length).to.eql(utils.values.length)
    expect(keys.length).to.eql(utils.keys.length)
    expect(data).to.eql(data1)
    callback()
  }
  
  db.readStream().on('error', utils.onerror)
    .pipe(cursor.each(first.each, first.end))
    .pipe(db1.writeStream())
})

suite('pipe all')

test('error param', function (callback) {
  var db1 = utils.db()
  var values = []
  var data = {}
  var keys = []

  var first = function (e, _keys, _values, _data) {
    assert.equal(e,  null)
    values = _values
    data = _data
    keys = _keys
    
    setTimeout(function () {
      cursor(db1.readStream()).all(second)
    }, 100)
  }
  
  var second = function (e, _keys, _values, _data) {
    assert.equal(e,  null)
    expect(values.length).to.eql(utils.values.length)
    expect(_values.length).to.eql(values.length)
    expect(_keys.length).to.eql(utils.keys.length)
    expect(_keys.length).to.eql(keys.length)
    expect(data).to.eql(_data)
    callback()
  }
  
  cursor(db.readStream()).all(first).pipe(db1.writeStream())
})

test('error event', function (callback) {
  var db1 = utils.db()
  var values = []
  var data = {}
  var keys = []

  var first = function (_keys, _values, _data) {
    values = _values
    data = _data
    keys = _keys
    
    setInterval(function () {
      db1.readStream().on('error', utils.onerror).pipe(cursor.all(second))
    }, 100)
  }
  
  var error = function (e) {
    assert.equal(e,  null)
  }

  var second = function (_keys, _values, _data) {
    expect(values.length).to.eql(utils.values.length)
    expect(_values.length).to.eql(values.length)
    expect(_keys.length).to.eql(utils.keys.length)
    expect(_keys.length).to.eql(keys.length)
    expect(data).to.eql(_data)
    callback()
  }
  
  db.readStream().on('error', utils.onerror)
    .pipe(cursor.all(first)).pipe(db1.writeStream())
})