if(process.env['CURSOR_COV']) var cursor = require('../../src-cov/cursor')
else var cursor = require('../../')

var assert = require('chai').assert,
    utils = require('../utils')

suite('error param error')

test('each', function (callback) {
  cursor(utils.readable()).each(utils.noop, function (e) {
    assert(e instanceof Error)
    callback()
  })
})

test('all', function (callback) {
  cursor(utils.readable()).all(function (e) {
    assert(e instanceof Error)
    callback()
  })
})

suite('error event error')

test('each', function (callback) {
  utils.readable().on('error', function (e) {
    assert(e instanceof Error)
    callback()
  }).pipe(cursor.each(utils.noop, function () {
    assert.equal(false, true, 'this shouldn\'t be called')
  }))
})

test('all', function (callback) {
  var called = false
  
  utils.readable().on('error', function (e) {
    assert(e instanceof Error)
    callback()
  }).pipe(cursor.all(function () {
    assert.equal(false, true, 'this shouldn\'t be called')
  }))
})