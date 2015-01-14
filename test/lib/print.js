/**
 * @file test for print
 * @author nighca<nighca@live.cn>
 */

var print = require('../../lib/print');

var parse = require('htmlcs/lib/parse');

var code = require('fs').readFileSync('test/fixture/test.html', 'utf-8');
//console.log(code);
console.log(print(parse(code)));
