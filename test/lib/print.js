/**
 * @file test for print
 * @author nighca<nighca@live.cn>
 */

var print = require('../../lib/print');

var parse = require('htmlcs/lib/parse');

var code = '<html><div id="div-1">DIV</div> space <p>ppp</p></html>';
console.log(code);
console.log(print(parse(code)));
