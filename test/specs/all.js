if(process.env['CURSOR_COV']) var cursor = require('../../lib-cov/cursor')
else var cursor = require('../../')

var utils = require('../utils'),
    chai = require('chai')

var assert = chai.assert
var expect = chai.expect
var db = utils.db()

suite('error param all')

before(function (callback) {
  utils.fill(db, utils.data, callback)
})

test('readStream', function (callback) {
  cursor(db.readStream()).all(function (e, keys, values) {
    assert.equal(e,  null)
    expect(values.length).to.equal(utils.values.length)
    expect(keys.length).to.equal(utils.keys.length)
    
    values.forEach(function (value) {
      expect(utils.values).to.include(value)
    })
    
    keys.forEach(function (key) {
      expect(utils.keys).to.include(key)
    })

    callback()
  })
})

test('keyStream', function (callback) {
  cursor(db.keyStream()).all(function (e, keys) {
    assert.equal(e,  null)
    expect(keys.length).to.equal(utils.keys.length)
    
    keys.forEach(function (key) {
      expect(utils.keys).to.include(key)
    })
  
    callback()
  })
})

test('valueStream', function (callback) {
  cursor(db.valueStream()).all(function (e, values) {
    assert.equal(e,  null)
    expect(values.length).to.equal(utils.values.length)
    
    values.forEach(function (value) {
      expect(utils.values).to.include(value)
    })

    callback()
  })
})

suite('error event all')

test('readStream', function (callback) {
  db.readStream().on('error', utils.onerror).pipe(cursor.all(function (keys, values) {
    expect(values.length).to.equal(utils.values.length)
    expect(keys.length).to.equal(utils.keys.length)
    
    values.forEach(function (value) {
      expect(utils.values).to.include(value)
    })
    
    keys.forEach(function (key) {
      expect(utils.keys).to.include(key)
    })
    
    callback()
  }))
})

test('keyStream', function (callback) {
  db.keyStream().on('error', utils.onerror).pipe(cursor.all(function (keys) {
    expect(keys.length).to.equal(utils.keys.length)
        
    keys.forEach(function (key) {
      expect(utils.keys).to.include(key)
    })
    
    callback()
  }))
})

test('valueStream', function (callback) {
  db.valueStream().on('error', utils.onerror).pipe(cursor.all(function (values) {
    expect(values.length).to.equal(utils.values.length)

    values.forEach(function (value) {
      expect(utils.values).to.include(value)
    })
    
    callback()
  }))
})