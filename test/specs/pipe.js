if(process.env['CURSOR_COV']) var cursor = require('../../lib-cov/cursor')
else var cursor = require('../../')

var utils = require('../utils'),
    assert = require('assert'),
    expect = require('chai').expect

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

  first.end = function () {
    var counts = 0
    return function (e) {
      counts += 1
      if(counts < 2) return
      
      assert.equal(e,  null)
      cursor(db1.readStream()).each(second.each, second.end)
    }
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
  
  var db1ws = db1.writeStream()
  var dbend = first.end()
  
  cursor(db.readStream()).each(first.each, dbend).pipe(db1ws)
  db1ws.on('close', dbend)
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
    var counts = 0
    
    return function () {
      counts += 1
      if(counts < 2) return
      
      db1.readStream().on('error', utils.onerror).pipe(cursor.each(second.each, second.end))
    }
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
  
  var db1ws = db1.writeStream()
  var dbend = first.end()
  
  db.readStream().on('error', utils.onerror)
    .pipe(cursor.each(first.each, dbend))
    .pipe(db1ws)
    
    db1ws.on('close', dbend)
})

suite('pipe all')

test('error param', function (callback) {
  var db1 = utils.db()
  var values = []
  var data = {}
  var keys = []

  var first = function () {
    var counts = 0
    return function (e, _keys, _values, _data) {
      counts += 1
      
      if(!(arguments.length < 4)) {
        assert.equal(e,  null)
        values = _values
        data = _data
        keys = _keys
      }
      
      if(counts < 2) return
      cursor(db1.readStream()).all(second)
    }
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
  
  var db1ws = db1.writeStream()
  var f = first()
  
  cursor(db.readStream()).all(f).pipe(db1ws)
  db1ws.on('close', f)
})

test('error event', function (callback) {
  var db1 = utils.db()
  var values = []
  var data = {}
  var keys = []

  var first = function () {
    var counts = 0
    
    return function (_keys, _values, _data) {
      counts += 1
      
      if(!(arguments.length < 3)) {
        values = _values
        data = _data
        keys = _keys
      }
      
      if(counts < 2) return
      db1.readStream().on('error', utils.onerror).pipe(cursor.all(second))
    }
  }

  var second = function (_keys, _values, _data) {
    expect(values.length).to.eql(utils.values.length)
    expect(_values.length).to.eql(values.length)
    expect(_keys.length).to.eql(utils.keys.length)
    expect(_keys.length).to.eql(keys.length)
    expect(data).to.eql(_data)
    callback()
  }
  
  var db1ws = db1.writeStream()
  var f = first()
  
  db.readStream().on('error', utils.onerror)
    .pipe(cursor.all(f)).pipe(db1ws)
  
  db1ws.on('close', f)
})