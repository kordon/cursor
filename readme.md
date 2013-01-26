# cursor

[levelup](https://github.com/rvagg/node-levelup) stream cursor

## install

```bash
npm install [--save/--save-dev] levelup-cursor
```

## api

```js
var cursor = require('levelup-cursor');
```

### each

#### readStream

```js
var stream = db.readStream()

stream.on('error', function (e) {
  throw e
})

stream.pipe(cursor.each(function (key, value, data) {
  assert.notEqual(value, undefined)
  assert.notEqual(key, undefined)
  assert.notEqual(value, null)
  assert.notEqual(key, null)
  
  assert.equal(value, data[key])  
}, function () {
  // end
}))
```

```js
var stream = db.readStream()

cursor(stream).each(function (key, value, data) {
  assert.notEqual(value, undefined)
  assert.notEqual(key, undefined)
  assert.notEqual(value, null)
  assert.notEqual(key, null)
  
  assert.equal(value, data[key]) 
}, function (e) {
  assert.equal(e, null || undefined)
  // end
})
```

#### valueStream

```js
var stream = db.valueStream()

stream.on('error', function (e) {
  throw e
})

stream.pipe(cursor.each(function (value) {
  assert.notEqual(value, undefined)
  assert.notEqual(value, null)
}, function () {
  // end
}))
```

```js
var stream = db.valueStream()

cursor(stream).each(function (value) {
  assert.notEqual(value, undefined)
  assert.notEqual(value, null)
}, function (e) {
  assert.equal(e, null || undefined)
  // end
})
```

#### keyStream

```js
var stream = db.keyStream()

stream.on('error', function (e) {
  throw e
})

stream.pipe(cursor.each(function (key) {
  assert.notEqual(key, undefined)
  assert.notEqual(key, null)
}, function () {
  // end
}))
```

```js
var stream = db.keyStream()

cursor(stream).each(function (key) {
  assert.notEqual(key, undefined)
  assert.notEqual(key, null)
}, function (e) {
  assert.equal(e, null || undefined)
  // end
})
```

### all

#### readStream

```js
var stream = db.readStream()

stream.on('error', function (e) {
  throw e
})

stream.pipe(cursor.all(function (keys, values, data) {
  assert.notEqual(values, undefined)
  assert.notEqual(keys, undefined)
  assert.notEqual(values, null)
  assert.notEqual(keys, null)
  
  assert.equal(Object.keys(data).length, keys.length)
}))
```

```js
var stream = db.readStream()

cursor(stream).all(function (e, keys, values, data) {
  assert.equal(e, null || undefined)

  assert.notEqual(values, undefined)
  assert.notEqual(keys, undefined)
  assert.notEqual(values, null)
  assert.notEqual(keys, null)
  
  assert.equal(Object.keys(data).length, keys.length)
})
```

#### valueStream

```js
var stream = db.valueStream()

stream.on('error', function (e) {
  throw e
})

stream.pipe(cursor.all(function (values) {
  assert.notEqual(values, undefined)
  assert.notEqual(values, null)
}))
```

```js
var stream = db.valueStream()

cursor(stream).all(function (e, values) {
  assert.equal(e, null || undefined)

  assert.notEqual(values, undefined)
  assert.notEqual(values, null)
})
```

#### keyStream

```js
var stream = db.keyStream()

stream.on('error', function (e) {
  throw e
})

stream.pipe(cursor.all(function (keys) {
  assert.notEqual(keys, undefined)
  assert.notEqual(keys, null)
}))
```

```js
var stream = db.keyStream()

cursor(stream).all(function (e, keys) {
  assert.equal(e, null || undefined)

  assert.notEqual(keys, undefined)
  assert.notEqual(keys, null)
})
```

### piping

```js
db.readStream().pipe(cursor.each()).pipe(otherdb.writeStream())
```

```js
cursor(db.readStream()).each().pipe(otherdb.writeStream())
```

```js
db.readStream().pipe(cursor.all()).pipe(otherdb.writeStream())
```

```js
cursor(db.readStream()).all().pipe(otherdb.writeStream())
```

## test 

[![Build Status](https://travis-ci.org/kordon/cursor.png)](https://travis-ci.org/kordon/cursor)

[100% coverage 57 SLOC](http://f.cl.ly/items/2a180M0j1Z1T2q112f3e/coverage.html)

```bash
npm test
```

## license

MIT
