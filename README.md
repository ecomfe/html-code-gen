html-code-gen
========

[![Build Status](https://travis-ci.org/nighca/html-code-gen.svg)](http://travis-ci.org/nighca/html-code-gen)
[![NPM version](https://badge.fury.io/js/html-code-gen.svg)](http://badge.fury.io/js/html-code-gen)
[![Coverage Status](https://coveralls.io/repos/nighca/html-code-gen/badge.svg?branch=master)](https://coveralls.io/r/nighca/html-code-gen?branch=master)
[![Dependencies](http://img.shields.io/david/nighca/html-code-gen.svg?style=flat-square)](https://david-dm.org/nighca/html-code-gen)
[![DevDependencies](http://img.shields.io/david/dev/nighca/html-code-gen.svg?style=flat-square)](https://david-dm.org/nighca/html-code-gen)

html-code-gen is a HTML-code generator. It generates HTML code with given dom(-like) object.

### Install

	npm install html-code-gen

### Usage

```javascript
var genner = require('html-code-gen'),
	output = genner.print(dom, opt);
```
### Options

* `indent-size`: size of indent

	default: `4`

* `indent-char`: char of indent ( space / tab )

	default: `'space'`

* `max-char`: max char num in one line

	default: `80` (TODO)

* `no-format-tag`: tags whose content should not be formatted

	default: [`spec.tagTypeMap.inline`](./lib/spec.js#L25)

* `no-format`: no format

	default: `false`

* `formatter`: special formatters { tagName ( script / style ) : formater )

	default: `{}`

* `level`: current level

	default: `0`
