html-code-gen
========

[![Build Status](https://travis-ci.org/nighca/html-code-gen.svg)](http://travis-ci.org/nighca/html-code-gen)
[![NPM version](https://badge.fury.io/js/html-code-gen.svg)](http://badge.fury.io/js/html-code-gen)
[![Coverage Status](https://coveralls.io/repos/nighca/html-code-gen/badge.png)](https://coveralls.io/r/nighca/html-code-gen)
[![Dependencies](http://img.shields.io/david/nighca/html-code-gen.svg?style=flat-square)](https://david-dm.org/nighca/html-code-gen)
[![DevDependencies](http://img.shields.io/david/dev/nighca/html-code-gen.svg?style=flat-square)](https://david-dm.org/nighca/html-code-gen)

html-code-gen is a HTML-code generator. It generates HTML code with given dom(-like) object.

### Install

	npm install html-code-gen

### Usage

```javascript
var genner = require('html-code-gen');

var output = genner.print(dom, opt);
```
