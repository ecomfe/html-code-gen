/**
 * @file print-element.js
 * @author nighca<nighca@live.cn>
 */

var util = require('./util');

var spec = require('./spec');

var booleanAttributes = spec.booleanAttributes,
    tagTypeMap = spec.tagTypeMap;

var array = Array.prototype;

var indent = function(opt){
    return util.indent(opt.level, opt['indent-char'], opt['indent-size']);
};

var printAttribute = function(attribute){
    // boolean attribute
    if(util.isIn(attribute.name, booleanAttributes)){
        return attribute.name;
    }

    return util.format('${name}="${value}"', attribute);
};

var printAttributes = function(attributes){
    if(!attributes) return '';

    return attributes.map(printAttribute).join(' ');
};

var printElementNode = function(node, opt){

    var tag = node.tagName.toLowerCase(),
        attributesStr = printAttributes(node.attributes);

    var info = {
        indent: indent(opt),
        tag: tag,
        attributes: attributesStr ? (' ' + attributesStr) : ''
    };

    // void elements
    if(util.isIn(tag, tagTypeMap['void'])){
        return util.format('${indent}<${tag}${attributes}>', info);
    }

    var newOpt = util.extend({}, opt);

    if(!opt['no-format'] && util.isIn(tag, opt['no-format-tag'])){
        newOpt['no-format'] = true;
    }

    var print = require('./print');

    if(util.isIn(tag, ['head', 'body'])) newOpt.level++;

    var output = array.map.call(node.childNodes, function(childNode){
        return print(childNode, newOpt);
    });

    output.unshift(util.format('${indent}<${tag}${attributes}>', info));
    output.push(util.format('${indent}</${tag}>', info));

    return output.filter(function(content){
        return content;
    }).join('\n');
};

module.exports = printElementNode;