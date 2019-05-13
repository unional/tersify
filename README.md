# tersify

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![Circle CI][circleci-image]][circleci-url]
[![Travis CI][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coveralls Status][coveralls-image]][coveralls-url]

[![Greenkeeper][greenkeeper-image]][greenkeeper-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

Create a readable terse representation of the subject.

You can specify `maxLength` to further trim the resulting string.

You can also override the result by providing your own `tersify()` function on the subject.

```ts
import { tersify } from 'tersify'

// `() => 'foo'`
tersify(() => 'foo')

// `fn(x, y) { return x + y; }`
tersify(function (x, y) { return x + y })

// Change result to 80 character long.
// result will have `...` to indicate info missing.
// e.g. `{ a: 'a', ... }`
tersify({...}, { maxLength: 80 })

// '{ a: 1 }`
tersify({ a: 1 })
```

## tersible

Inject a `tersify()` function to the subject.

```ts
import { tersible } from 'tersify'

const increment = tersible(a => a + 1, () => 'a++')
increment.tersify() // 'a++'

// `{ a: 1 }`
tersible({ a: 1 }, function () { return `{ a: ${this.a} }`}).tersify()

const decrement = tersible(a => a--, 'a--')
decrement.tersify() // 'a--'

// `a: 10`
tersible({ a: 1 }, options => `a: ${options.maxLength}`).tersify({ maxLength: 10 })
```

## Tersiblized

Mixin `Tersible` to a class.

```ts
import { Tersiblized } from 'tersify'

class Foo { a = 1 }
class Boo extends Tersiblized(Foo, function() { return `{ a: ${this.a} }` }) { }

const boo = new Boo()
boo.a = 3
boo.tersify() // '{ a: 3 }'
```

## Contribute

```sh
# right after fork
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# edit `webpack.config.dev.js` to exclude dependencies for the global build.

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

## Npm Commands

There are a few useful commands you can use during development.

```sh
# Run tests (and lint) automatically whenever you save a file.
npm run watch

# Run tests with coverage stats (but won't fail you if coverage does not meet criteria)
npm run test

# Manually verify the project.
# This will be ran during 'npm preversion' so you normally don't need to run this yourself.
npm run verify

# Build the project.
# You normally don't need to do this.
npm run build

# Run tslint
# You normally don't need to do this as `npm run watch` and `npm version` will automatically run lint for you.
npm run lint
```

Generated by `generator-unional@0.0.1`

## TODO

- [ ] work on browser

[circleci-image]: https://circleci.com/gh/unional/tersify/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/tersify/tree/master
[codecov-image]: https://codecov.io/gh/unional/tersify/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/tersify
[coveralls-image]: https://coveralls.io/repos/github/unional/tersify/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/unional/tersify?branch=master
[downloads-image]: https://img.shields.io/npm/dm/tersify.svg?style=flat
[downloads-url]: https://npmjs.org/package/tersify
[greenkeeper-image]: https://badges.greenkeeper.io/unional/tersify.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-image]: https://img.shields.io/npm/v/tersify.svg?style=flat
[npm-url]: https://npmjs.org/package/tersify
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[travis-image]: https://img.shields.io/travis/unional/tersify/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/tersify?branch=master
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
