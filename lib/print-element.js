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

var printVoidElementNode = function(info, node, condition){
    return util.format('<${tag}${attributes}>', info);
};

var printRawTextElementNode = function(info, node, condition){
    var content = node.childNodes[0].textContent.replace(/(^\s*\n)|(\n\s*$)/g, '');

    return [
        info.start,
        content,
        info.end
    ].join(info.sep);
};

var printNormalElementNode = function(info, node, condition){
    // children
    var children = array.map.call(node.childNodes, function(childNode, i){
        return print(childNode, newOpt);
    });

    // inner content
    var content = (
        condition.noFormat ?
        children :
        children.filter(function(child){
            return child.trim()
        }).map(function(child){
            return info.innerIndent + child;
        })
    ).join(info.sep);

    // format & output
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
        noFormat: opt['no-format'] || util.isIn(tag, opt['no-format-tag']),
        isRawText: util.isIn(tag, tagTypeMap['raw-text'])
    };

    // node info
    var info = {
        indent: indent(opt),
        tag: tag,
        attributes: attributesStr ? (' ' + attributesStr) : ''
    };

    // void elements
    if(condition.isVoid) return printVoidElementNode(info, node, condition);

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
    if(condition.isRawText) return printRawTextElementNode(info, node, condition);

    return printNormalElementNode(info, node, condition);
};

module.exports = printElementNode;