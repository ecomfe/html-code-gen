/**
 * @file print.js
 * @author nighca<nighca@live.cn>
 */

var spec = require('./spec');

var array = Array.prototype;

// TEXT_NODE
var printTextNode = function(node, opt){
    return node.textContent;
};

// COMMENT_NODE
var printCommentNode = function(node, opt){
    return '<!--' + node.textContent + '-->';
};

// CDATA_SECTION_NODE
var printCDATASectionNode = function(node, opt){
    return '<![CDATA[' + node.textContent + ']]>';
};

// DOCUMENT_TYPE_NODE
var printDocumentTypeNode = function(node, opt){
    return '<!DOCTYPE ' + node.name + '>';
};

// DOCUMENT_NODE
var printDocumentNode = function(node, opt){
    return array.map.call(node.childNodes, function(childNode){
        return print(childNode, opt);
    }).join('');
};

// ELEMENT_NODE
var printElementNode = require('./print-element');

// general print
var print = function(node, opt){

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