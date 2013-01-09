var levelup = require('levelup'),
    cursor = require('..'),
    chai = require('chai'),
    path = require('path'),
    sgen = require('sgen')

var expect = chai.expect
var assert = chai.assert

var values = require('./values.json')
var data = require('./data.json')
var keys = require('./keys.json')
var kv = require('./kv.json')

var root = path.join(path.dirname(__filename), 'dbs')

var genDB = function () {
  return levelup(path.join(root, sgen.timestamp()), {
    createIfMissing: true,
    errorIfExists: false
  })
}

var db = genDB()

before(function (callback) {
  db.batch(data, function (e) {
    assert.equal(e,  null)
    callback()
  })
})

suite('each')

test('readStream', function (callback) {
  var _values = []
  var _keys = []
  var _data = []
  var i = 0
  
  db.readStream().pipe(cursor.each(function (data) {
    expect(kv[data.key]).to.equal(data.value)
    expect(values[i]).to.equal(data.value)
    expect(keys[i]).to.equal(data.key)
    
    data.type = 'put'
    _values.push(data.value)
    _keys.push(data.key)
    _data.push(data)
    
    i += 1
  }, function (e) {
    assert.equal(e,  null)
    
    expect(_values).to.eql(values)
    expect(_keys).to.eql(keys)
    expect(_data).to.eql(data)
    callback()
  }))
})

test('keyStream', function (callback) {
  var _keys = []
  var i = 0

  db.readStream().pipe(cursor.each(function (data) {
    expect(keys[i]).to.equal(data.key)
    _keys.push(data.key)
    i += 1
  }, function (e) {
    assert.equal(e,  null)
    expect(_keys).to.eql(keys)
    callback()
  }))
})

test('valueStream', function (callback) {
  var _values = []
  var i = 0

  db.readStream().pipe(cursor.each(function (data) {
    expect(values[i]).to.equal(data.value)
    _values.push(data.value)
    i += 1
  }, function (e) {
    assert.equal(e,  null)
    expect(_values).to.eql(values)
    callback()
  }))
})

test('pipe', function (callback) {
  var db1 = genDB()
  var data = []

  db.readStream().pipe(cursor.each(function (row) {
    data.push(row)
  }, function (e) {
    assert.equal(e,  null)
    db.readStream().pipe(cursor.all(function (e, data1) {
      expect(data).to.eql(data1)
      callback()
    }))
  })).pipe(db1.writeStream())
})

suite('all')

test('readStream', function (callback) {
  var _values = []
  var _keys = []
  var _data = []
  var i = 0
  
  db.readStream().pipe(cursor.all(function (e, data) {
    assert.equal(e,  null)
    
    data.forEach(function (user) {
      expect(kv[user.key]).to.equal(user.value)
      expect(values[i]).to.equal(user.value)
      expect(keys[i]).to.equal(user.key)
      
      _values.push(user.value)
      _keys.push(user.key)
      _data.push(user)
      
      i += 1
    })
    
    expect(_values).to.eql(values)
    expect(_keys).to.eql(keys)
    expect(_data).to.eql(data)
    
    callback()
  }))
})

test('keyStream', function (callback) {
  var _keys = []
  var i = 0

  db.readStream().pipe(cursor.all(function (e, data) {
    assert.equal(e,  null)

    data.forEach(function (user) {
      expect(keys[i]).to.equal(user.key)
      _keys.push(user.key)
      i += 1
    })

    expect(_keys).to.eql(keys)
    callback()
  }))
})

test('valueStream', function (callback) {
  var _values = []
  var i = 0

  db.readStream().pipe(cursor.all(function (e, data) {
    assert.equal(e,  null)

    data.forEach(function (user) {
      expect(values[i]).to.equal(user.value)
      _values.push(user.value)
      i += 1
    })

    expect(_values).to.eql(values)
    callback()
  }))
})

test('pipe', function (callback) {
  var db1 = genDB()
  
  db.readStream().pipe(cursor.all(function (e, data) {
    assert.equal(e,  null)
    db.readStream().pipe(cursor.all(function (e, data1) {
      expect(data).to.eql(data1)
      callback()
    }))
  })).pipe(db1.writeStream())
})