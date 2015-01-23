/**
 * @file test for print
 * @author nighca<nighca@live.cn>
 */

var print = require('../../lib/print');

var fs = require('fs');
var parse = require('htmlcs/lib/parse');

var code = fs.readFileSync('test/case/test.html', 'utf-8');
var formatted = print(parse(code));

fs.writeFileSync('test/case/test-formatted.html', formatted);