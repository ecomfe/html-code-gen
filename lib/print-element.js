/**
 * @file print-element.js
 * @author nighca<nighca@live.cn>
 */

var array = Array.prototype;

var printElementNode = function(node, opt){

	var print = require('./print');

    return '<' + node.tagName.toLowerCase() + '>' +
        array.map.call(node.childNodes, function(childNode){
            return print(childNode, opt);
        }).join('') +
        '</' + node.tagName.toLowerCase() + '>';

};

module.exports = printElementNode;