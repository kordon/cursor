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
  assert(data.value)
  assert(data.key)
}, function (e) {
  assert.equal(e,  null)
}))
```

### all

```js
db.readStream().pipe(cursor.all(function (e, data) {
  assert.equal(e,  null)
  assert(data instanceof Array)
}))
```

### pipe

```js
db.readStream().pipe(cursor.each(function (data) {
  assert(data.value)
  assert(data.key)
}, function (e) {
  assert.equal(e,  null)
})).pipe(db1.writeStream())
```

```js
db.readStream().pipe(cursor.all(function (e, data) {
  assert.equal(e,  null)
  assert(data instanceof Array)
})).pipe(db1.writeStream())
```

## test [![Build Status](https://travis-ci.org/kordon/cursor.png)](https://travis-ci.org/kordon/cursor)

```bash
npm test
```

## license

MIT