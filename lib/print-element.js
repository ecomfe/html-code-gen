/**
 * @file print method for element
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

    return array.map.call(attributes, printAttribute).join(' ');
};

var printVoidElementNode = function(info, node, condition, opt){
    return util.format('<${tag}${attributes}>', info);
};

var packageElement = function(info, content){
    return (
        content ?
        [
            info.start,
            content,
            info.end
        ] :
        [
            info.start,
            info.end
        ]
    ).join(info.sep);
};

var removeSpaceAround = function(content){
    return content.replace(/(^\s*\n)|(\n\s*$)/g, '');
};

var printRawTextElementNode = function(info, node, condition, opt){
    var formatter = opt.formatter[info.tag] || removeSpaceAround;

    var content = node.childNodes.length ?
        formatter(node.childNodes[0].textContent, node, opt, {
            indent: indent
        }) :
        '';

    return packageElement(info, content);
};

var printNormalElementNode = function(info, node, condition, opt){
    var content = (
        condition.noFormat ?
        info.children :
        info.children.filter(function(child){
            return child.trim()
        }).map(function(child){
            return info.innerIndent + child;
        })
    ).join(info.sep);

    return packageElement(info, content);
};

// format method for general element
var printElementNode = function(node, opt){

    // print method for node
    var print = require('./print');

    var tag = node.tagName.toLowerCase(),
        attributesStr = printAttributes(node.attributes);

    // conditions
    var condition = {
        isVoid: util.isIn(tag, tagTypeMap['void']),
        isHtml: tag === 'html',
        noFormat: opt['no-format'] || util.isIn(tag, opt['no-format-tag']) || !node.childNodes.length,
        isRawText: util.isIn(tag, tagTypeMap['raw-text'])
    };

    // node info
    var info = {
        indent: indent(opt),
        tag: tag,
        attributes: attributesStr ? (' ' + attributesStr) : ''
    };

    // void elements
    if(condition.isVoid) return printVoidElementNode(info, node, condition, opt);

    // new opt for next-level (child) nodes
    var newOpt = util.extend({}, opt);

    // increase level
    // do not indent 'head' & 'body' (under 'html')
    if(!condition.isHtml) newOpt.level++;

    // tag start & end
    util.extend(info, {
        start: util.format('<${tag}${attributes}>', info),
        end: (condition.noFormat ? '' : info.indent) + util.format('</${tag}>', info),
        sep: condition.noFormat ? '' : '\n',
        // indent for child nodes
        innerIndent: indent(newOpt)
    });

    // raw text ( 'script' / 'style' )
    if(condition.isRawText) return printRawTextElementNode(info, node, condition, opt);

    // children
    util.extend(info, {
        children: array.map.call(node.childNodes, function(childNode, i){
            return print(childNode, newOpt);
        })
    });

    return printNormalElementNode(info, node, condition, opt);
};

module.exports = printElementNode;