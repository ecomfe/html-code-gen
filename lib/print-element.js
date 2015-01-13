/**
 * @file print-element.js
 * @author nighca<nighca@live.cn>
 */

var util = require('./util');

var spec = require('./spec');

var booleanAttributes = spec.booleanAttributes,
    tagTypeMap = spec.tagTypeMap;

var array = Array.prototype;

var printAttribute = function(attribute){
    // boolean attribute
    if(booleanAttributes.indexOf(attribute.name) >= 0){
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
        tag: tag,
        attributes: attributesStr ? (' ' + attributesStr) : ''
    };

    // void elements
    if(tagTypeMap['void'].indexOf(tag) >= 0){
        return util.format('<${tag}${attributes}>', info);
    }

    var print = require('./print');
    info.content = array.map.call(node.childNodes, function(childNode){
        return print(childNode, opt);
    }).join('');

    return util.format('<${tag}${attributes}>${content}</${tag}>', info);

};

module.exports = printElementNode;