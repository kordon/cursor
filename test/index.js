var levelup = require('levelup'),
    cursor = require('..'),
    chai = require('chai'),
    path = require('path'),
    sgen = require('sgen')

var expect = chai.expect,
    assert = chai.assert

var values = require('./values.json'),
    data = require('./data.json'),
    keys = require('./keys.json'),
    kv = require('./kv.json')

var root = path.join(path.dirname(__filename), 'dbs')

var genDB = function () {
  return levelup(path.join(root, sgen.timestamp()), {
    createIfMissing: true,
    errorIfExists: false
  })
};

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
    var key = Object.keys(data).pop()
    var value = data[key]
    
    expect(values).to.include(value)
    expect(kv[key]).to.equal(value)
    expect(keys).to.include(key)

    _values.push(value)
    _keys.push(key)
  }, function (e) {
    assert.equal(e,  null)

    expect(_values.length).to.eql(values.length)
    expect(_keys.length).to.eql(keys.length)
    callback()
  }))
})

test('readStream', function (callback) {
  var _values = []
  var _keys = []
  var _data = []
  var i = 0

  db.readStream().pipe(cursor.each(function (data) {
    var key = Object.keys(data).pop()
    var value = data[key]

    expect(values).to.include(value)
    expect(kv[key]).to.equal(value)
    expect(keys).to.include(key)

    _values.push(value)
    _keys.push(key)
  }, function (e) {
    assert.equal(e,  null)

    expect(_values.length).to.eql(values.length)
    expect(_keys.length).to.eql(keys.length)
    callback()
  }))
})

test('keyStream', function (callback) {
  var _keys = []

  db.keyStream().pipe(cursor.each(function (key) {
    expect(keys).to.include(key)
    _keys.push(key)
  }, function (e) {
    assert.equal(e,  null)
    expect(_keys.length).to.eql(keys.length)
    callback()
  }))
})

test('valueStream', function (callback) {
  var _values = []
  var i = 0

  db.valueStream().pipe(cursor.each(function (value) {
    expect(values).to.include(value)
    _values.push(value)
    i += 1
  }, function (e) {
    assert.equal(e,  null)
    expect(_values.length).to.eql(values.length)
    callback()
  }))
})

test('pipe', function (callback) {
  var db1 = genDB()
  var data = {}

  db.readStream().pipe(cursor.each(function (row) {
    var key = Object.keys(row).pop()
    data[key] = row[key]
  }, function (e) {
    assert.equal(e,  null)
    db1.readStream().pipe(cursor.all(function (e, data1) {
      expect(data).to.eql(data1)
      callback()
    }))
  })).pipe(db1.writeStream())
})

suite('all')

test('readStream', function (callback) {
  var _values = []
  var _keys = []

  db.readStream().pipe(cursor.all(function (e, _data) {
    assert.equal(e,  null)

    Object.keys(_data).forEach(function (key) {
      var value = _data[key]
      
      expect(kv[key]).to.equal(_data[key])
      expect(values).to.include(value)
      expect(keys).to.include(key)
      
      _values.push(_data[key])
      _keys.push(key)
    })

    expect(data.length).to.eql(Object.keys(_data).length)
    expect(_values.length).to.eql(values.length)
    expect(_keys.length).to.eql(keys.length)
    callback()
  }))
})

test('keyStream', function (callback) {
  db.keyStream().pipe(cursor.all(function (e, _keys) {
    assert.equal(e,  null)

    _keys.forEach(function (key) {
      expect(_keys).to.include(key)
    })

    expect(_keys.length).to.eql(keys.length)

    callback()
  }))
})

test('valueStream', function (callback) {
  var _values = []

  db.valueStream().pipe(cursor.all(function (e, data) {
    assert.equal(e,  null)

    data.forEach(function (value) {
      expect(values).to.include(value)
      _values.push(value)
    })

    expect(_values.length).to.eql(values.length)
    callback()
  }))
})

test('pipe', function (callback) {
  var db1 = genDB()

  db.readStream().pipe(cursor.all(function (e, data) {
    assert.equal(e,  null)
    db1.readStream().pipe(cursor.all(function (e, data1) {
      expect(data).to.eql(data1)
      callback()
    }))
  })).pipe(db1.writeStream())
})