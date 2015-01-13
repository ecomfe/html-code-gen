/**
 * @file test for print
 * @author nighca<nighca@live.cn>
 */

var print = require('../../lib/print');

var parse = require('htmlcs/lib/parse');

var code = '<html>\n\t<script src="xxx"></script>\n\t<input type="text" disabled>\n\t<div id="div-1">DIV<!--comment--></div>\n\t space \n\t<p>ppp</p>\n</html>';
console.log(code);
console.log(print(parse(code)));
