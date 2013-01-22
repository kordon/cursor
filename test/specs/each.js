var utils = require('../utils'),
    cursor = require('../../'),
    chai = require('chai')

var assert = chai.assert
var expect = chai.expect
var db = utils.db()

suite('error param each')

before(function (callback) {
  utils.fill(db, utils.data, callback)
})

test('readStream', function (callback) {
  var values = []
  var keys = []
  
  cursor(db.readStream()).each(function (key, value, data) {
    expect(utils.values).to.include(value)
    expect(utils.kv[key]).to.equal(value)
    expect(utils.keys).to.include(key)
    expect(value).to.equal(data[key])
    values.push(value)
    keys.push(key)
  }, function (e) {
    assert.equal(e,  null)
    expect(values.length).to.eql(utils.values.length)
    expect(keys.length).to.eql(utils.keys.length)
    callback()
  })
})

test('keyStream', function (callback) {
  var keys = []

  cursor(db.keyStream()).each(function (key) {
    expect(utils.keys).to.include(key)
    keys.push(key)
  }, function (e) {
    assert.equal(e,  null)
    expect(keys.length).to.eql(utils.keys.length)
    callback()
  })
})

test('valueStream', function (callback) {
  var values = []

  cursor(db.valueStream()).each(function (value) {
    expect(utils.values).to.include(value)
    values.push(value)
  }, function (e) {
    assert.equal(e,  null)
    expect(values.length).to.eql(utils.values.length)
    callback()
  })
})

suite('error event each')

test('readStream', function (callback) {
  var values = []
  var keys = []
  
  db.readStream().pipe(cursor.each(function (key, value, data) {
    expect(utils.values).to.include(value)
    expect(utils.kv[key]).to.equal(value)
    expect(utils.keys).to.include(key)
    expect(value).to.equal(data[key])
    values.push(value)
    keys.push(key)
  }, function (e) {
    assert.equal(e,  null)
    expect(values.length).to.eql(utils.values.length)
    expect(keys.length).to.eql(utils.keys.length)
    callback()
  }))
})

test('keyStream', function (callback) {
  var keys = []
  
  db.keyStream().pipe(cursor.each(function (key) {
    expect(utils.keys).to.include(key)
    keys.push(key)
  }, function (e) {
    assert.equal(e,  null)
    expect(keys.length).to.eql(utils.keys.length)
    callback()
  }))
})

test('valueStream', function (callback) {
  var values = []
  
  db.valueStream().pipe(cursor.each(function (value) {
    expect(utils.values).to.include(value)
    values.push(value)
  }, function (e) {
    assert.equal(e,  null)
    expect(values.length).to.eql(utils.values.length)
    callback()
  }))
})