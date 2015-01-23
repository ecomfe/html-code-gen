/**
 * @file print.js
 * @author nighca<nighca@live.cn>
 */

var spec = require('./spec');

var util = require('./util');

var array = Array.prototype;

var indent = function(opt){
    return util.indent(opt.level, opt['indent-char'], opt['indent-size']);
};

// TEXT_NODE
var printTextNode = function(node, opt){
    return node.textContent.split('\n').map(function(line){
        line = line.trim();
        return line ? (indents + line) : '';
    }).filter(function(line){
        return line;
    }).join(' ');
};

// COMMENT_NODE
var printCommentNode = function(node, opt){
    return indent(opt) + '<!--' + node.textContent + '-->';
};

// CDATA_SECTION_NODE
var printCDATASectionNode = function(node, opt){
    return indent(opt) + '<![CDATA[' + node.textContent + ']]>';
};

// DOCUMENT_TYPE_NODE
var printDocumentTypeNode = function(node, opt){
    return indent(opt) + '<!DOCTYPE ' + node.name + '>';
};

// DOCUMENT_NODE
var printDocumentNode = function(node, opt){
    return indent(opt) +
        array.map.call(node.childNodes, function(childNode){
            return print(childNode, opt);
        }).filter(function(content){
            return content;
        }).join('\n');
};

// ELEMENT_NODE
var printElementNode = require('./print-element');

// general print
var print = function(node, opt){

    // default options
    opt = util.extend({
        'indent-size': 4,
        'indent-char': 'space',
        'max-char': 80,
        'no-format-tag': [],
        'no-format': false,

        'level': 0
    }, opt);

    var typeMap = spec.nodeType;

    var output = '';

    switch(node.nodeType){

        case typeMap.TEXT_NODE:
            output = printTextNode(node, opt);
            break;

        case typeMap.COMMENT_NODE:
            output = printCommentNode(node, opt);
            break;

        case typeMap.CDATA_SECTION_NODE:
            output = printCDATASectionNode(node, opt);
            break;

        case typeMap.DOCUMENT_TYPE_NODE:
            output = printDocumentTypeNode(node, opt);
            break;

        case typeMap.DOCUMENT_NODE:
            output = printDocumentNode(node, opt);
            break;

        case typeMap.ELEMENT_NODE:
            output = printElementNode(node, opt);
            break;

        default:
            output = '';
    }

    return output;

};

module.exports = print;