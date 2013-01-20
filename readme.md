# range

[levelup](https://github.com/rvagg/node-levelup) stream cursor

## install

```bash
npm install [--save/--save-dev] cursor
```

## api

```js
var cursor = require('levelup-cursor');
```

### each

```js
db.readStream().pipe(cursor.each(function (data) {
  assert(data)
  var key = Object.keys(data).pop()
  var value = data[key]
  assert(value)
  assert(key)
}, function (e) {
  assert.equal(e,  null)
}))
```

```js
db.keyStream().pipe(cursor.each(function (data) {
  assert(data)
}, function (e) {
  assert.equal(e,  null)
}))
```

```js
db.valueStream().pipe(cursor.each(function (data) {
  assert(data)
}, function (e) {
  assert.equal(e,  null)
}))
```

### all

```js
db.readStream().pipe(cursor.all(function (e, data) {
  assert.equal(e,  null)
  var keys = Object.keys(data)
  assert(data instanceof Array)
  assert(keys.length)
}))
```

```js
db.keyStream().pipe(cursor.all(function (e, data) {
  assert.equal(e,  null)
  assert(data instanceof Array)
  assert(data.length)
}))
```

```js
db.valuesStream().pipe(cursor.all(function (e, data) {
  assert.equal(e,  null)
  assert(data instanceof Array)
  assert(data.length)
}))
```

### pipe

```js
db.readStream().pipe(cursor.each(function (data) {
  assert(data)
  var key = Object.keys(data).pop()
  var value = data[key]
  assert(value)
  assert(key)
}, function (e) {
  assert.equal(e,  null)
})).pipe(db1.writeStream())
```

```js
db.readStream().pipe(cursor.all(function (e, data) {
  assert.equal(e,  null)
  var keys = Object.keys(data)
  assert(data instanceof Array)
  assert(keys.length)
})).pipe(db1.writeStream())
```

## test [![Build Status](https://travis-ci.org/kordon/cursor.png)](https://travis-ci.org/kordon/cursor)

```bash
npm test
```

## license

MIT