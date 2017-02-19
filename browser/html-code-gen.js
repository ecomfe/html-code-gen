!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.htmlCodeGen=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file gen code with given dom(-like) object
 * @author nighca<nighca@live.cn>
 */

module.exports = require('./lib/print');

},{"./lib/print":3}],2:[function(require,module,exports){
/**
 * @file print method for element
 * @author nighca<nighca@live.cn>
 */

var util = require('./util');

var spec = require('./spec');

var booleanAttributes = spec.booleanAttributes;
var tagTypeMap = spec.tagTypeMap;

var array = Array.prototype;

var indent = function (opt) {
    return util.indent(opt.level, opt['indent-char'], opt['indent-size']);
};

var printAttribute = function (attribute, opt) {
    // boolean attribute
    if (util.isIn(attribute.name, booleanAttributes)) {
        if (
            opt['bool-attribute-value'] === 'remove'
            || !attribute.value
        ) {
            return attribute.name;
        }
    }

    return util.format('${name}="${value}"', attribute);
};

var printAttributes = function (attributes, opt) {
    if (!attributes) {
        return '';
    }

    return array.map.call(attributes, function (attribute) {
        return printAttribute(attribute, opt);
    }).join(' ');
};

var printVoidElementNode = function (info, node, condition, opt) {
    var tpl = opt['self-close'] === 'close'
        ? '<${tag}${attributes} />'
        : '<${tag}${attributes}>';
    return util.format(tpl, info);
};

var packageElement = function (info, content) {
    var parts = (
        content
        ? [
            info.start,
            content,
            info.end
        ]
        : [
            info.start,
            info.end
        ]
    );
    return parts.join(info.sep);
};

var removeBlankLineAround = function (content) {
    return content.replace(/(^(\s*\n)+)|((\n\s*)+$)/g, '');
};

var makePrintRawTextElementNode = function (async) {
    return function (info, node, condition, opt) {
        var formatter = opt.formatter[info.tag] || removeBlankLineAround;

        var contentOpt = util.extend({}, opt);
        contentOpt.level++;

        var indentContent = function (content, indentOpt) {
            indentOpt = indentOpt || contentOpt;
            return content.split('\n').map(function (line) {
                return line ? (indent(indentOpt) + line) : line;
            }).join('\n');
        };

        var content = node.childNodes.length
            ? formatter(node.childNodes[0].textContent, node, contentOpt, {
                indent: indentContent,
                trim: removeBlankLineAround
            })
            : '';

        if (!async) {
            return packageElement(info, content);
        }

        return Promise.resolve(content).then(
            function (content) {
                return packageElement(info, content);
            }
        );
    };
};

var printRawTextElementNode = makePrintRawTextElementNode(false);
var printRawTextElementNodeAsync = makePrintRawTextElementNode(true);

var printNormalElementNode = function (info, node, condition, opt) {
    var children = (
        condition.newLine
        ? info.children.map(function (child) {
            child = child.trim();
            return child ? (info.innerIndent + child) : child;
        }).filter(function (child) {
            return child;
        })
        : info.children
    );
    var content = children.join(info.sep);

    return packageElement(info, content);
};

var makePrintElementNode = function (async) {
    // format method for general element
    return function (node, opt) {

        // print method for node
        var printMethods = require('./print');

        var tag = node.tagName.toLowerCase();
        var attributesStr = printAttributes(node.attributes, opt);

        // conditions
        var condition = {
            isVoid: util.isIn(tag, tagTypeMap.void),
            isHtml: tag === 'html',
            noFormat: opt['no-format'] || util.isIn(tag, opt['no-format-tag']),
            inline: util.isIn(tag, opt['inline-tag']) || !node.childNodes.length,
            isRawText: util.isIn(tag, tagTypeMap['raw-text'])
        };
        condition.newLine = !(condition.noFormat || condition.inline);

        // node info
        var info = {
            indent: indent(opt),
            tag: tag,
            attributes: attributesStr ? (' ' + attributesStr) : ''
        };

        // void elements
        if (condition.isVoid) {
            return printVoidElementNode(info, node, condition, opt);
        }

        // new opt for next-level (child) nodes
        var newOpt = util.extend({}, opt);

        // no-format should be inheritted
        if (condition.noFormat) {
            newOpt['no-format'] = true;
        }

        // increase level
        // do not indent 'head' & 'body' (under 'html')
        if (!condition.isHtml) {
            newOpt.level++;
        }

        // tag start & end
        util.extend(info, {
            start: util.format('<${tag}${attributes}>', info),
            end: (condition.newLine ? info.indent : '') + util.format('</${tag}>', info),
            sep: condition.newLine ? '\n' : '',
            // indent for child nodes
            innerIndent: indent(newOpt)
        });

        // raw text ( 'script' / 'style' )
        if (condition.isRawText) {
            return (
                async
                ? printRawTextElementNodeAsync(info, node, condition, opt)
                : printRawTextElementNode(info, node, condition, opt)
            );
        }

        if (!async) {
            // children
            util.extend(info, {
                children: array.map.call(node.childNodes, function (childNode, i) {
                    return printMethods.print(childNode, newOpt);
                })
            });
            return printNormalElementNode(info, node, condition, opt);
        }

        return Promise.all(
            array.map.call(node.childNodes, function (childNode, i) {
                return printMethods.printAsync(childNode, newOpt);
            })
        ).then(function (children) {
            util.extend(info, {children: children});
            return printNormalElementNode(info, node, condition, opt);
        });
    };
};

var printElementNode = makePrintElementNode(false);
var printElementNodeAsync = makePrintElementNode(true);

module.exports = {
    printElementNode: printElementNode,
    printElementNodeAsync: printElementNodeAsync
};

},{"./print":3,"./spec":4,"./util":5}],3:[function(require,module,exports){
/**
 * @file print methods for different kinds of node
 * @author nighca<nighca@live.cn>
 */

var spec = require('./spec');

var util = require('./util');

var array = Array.prototype;

// TEXT_NODE
var printTextNode = function (node, opt) {
    return opt['no-format']
        ? node.textContent
        : node.textContent.replace(/[\s\n\r]+/g, ' ');
};

// COMMENT_NODE
var printCommentNode = function (node, opt) {
    return '<!--' + node.textContent + '-->';
};

// CDATA_SECTION_NODE
var printCDATASectionNode = function (node, opt) {
    return '<![CDATA[' + node.textContent + ']]>';
};

// DOCUMENT_TYPE_NODE
var printDocumentTypeNode = function (node, opt) {
    if (!node.publicId && !node.systemId) {
        return '<!DOCTYPE ' + node.name + '>';
    }

    var output = '<!DOCTYPE ' + node.name;

    if (node.publicId) {
        output += ' PUBLIC';
        output += ' "' + node.publicId + '"';
    }
    else {
        output += ' SYSTEM';
    }

    if (node.systemId) {
        output += ' "' + node.systemId + '"';
    }

    output += '>';

    return output;
};

var print;
var printAsync;

// DOCUMENT_NODE
var printDocumentNode = function (node, opt) {
    return array.map.call(node.childNodes, function (childNode) {
        return print(childNode, opt);
    }).filter(function (content) {
        return content.trim();
    }).join('\n');
};

var printDocumentNodeAsync = function (node, opt) {
    return Promise.all(
        array.map.call(node.childNodes, function (childNode) {
            return printAsync(childNode, opt);
        })
    ).then(
        function (children) {
            return children.filter(function (content) {
                return content.trim();
            }).join('\n');
        }
    );
};

// ELEMENT_NODE
var printElementMethods = require('./print-element');
var printElementNode = printElementMethods.printElementNode;
var printElementNodeAsync = printElementMethods.printElementNodeAsync;

// general print
var makePrint = function (async) {
    return function (node, opt) {

        // default options
        opt = util.extend({
            // size of indent
            'indent-size': 4,
            // char of indent ( space / tab )
            'indent-char': 'space',
            // max char num in one line
            'max-char': 80,
            // tags whose content should not be formatted
            'no-format-tag': spec.tagTypeMap.structural,
            // no format
            'no-format': false,
            // tags whose content should be inline
            'inline-tag': spec.tagTypeMap.inline,
            // special formatters { tagName ( script / style ) : formatter }
            'formatter': {},
            // hide value of boolean attribute or not ( 'remove' / 'preserve' )
            'bool-attribute-value': 'remove',
            // Should void tags close themeselves with "/" ( 'close' / 'no-close' )
            'self-close': 'no-close',
            // current level
            'level': 0
        }, opt);

        var typeMap = spec.nodeType;

        var output;

        switch (node.nodeType) {

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
                output = (
                    async
                    ? printDocumentNodeAsync
                    : printDocumentNode
                )(node, opt);
                break;

            case typeMap.ELEMENT_NODE:
                output = (
                    async
                    ? printElementNodeAsync
                    : printElementNode
                )(node, opt);
                break;

            default:
                output = '';
        }

        return (
            async
            ? Promise.resolve(output)
            : output
        );

    };
};

print = makePrint(false);
printAsync = makePrint(true);

module.exports = {
    print: print,
    printAsync: printAsync
};

},{"./print-element":2,"./spec":4,"./util":5}],4:[function(require,module,exports){
/**
 * @file some spec info
 * @author nighca<nighca@live.cn>
 */

var nodeType = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11
};

// http://www.w3.org/TR/html5/syntax.html#elements-0
var tagTypeMap = {
    'void': [
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link',
        'meta', 'param', 'source', 'track', 'wbr'
    ],
    'raw-text': ['script', 'style'],
    'escapable-raw-text': ['textarea', 'title'],
    'inline': [
        'a', 'span', 'img', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd',
        'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b',
        'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address',
        'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'title'
    ],
    'structural': ['pre', 'textarea', 'code']
};

var booleanAttributes = [
    'allowfullscreen', 'async', 'autofocus', 'autoplay',
    'checked', 'controls', 'default', 'defer',
    'disabled', 'formnovalidate', 'hidden', 'ismap',
    'itemscope', 'loop', 'multiple', 'muted', 'novalidate',
    'open', 'readonly', 'required', 'reversed',
    'scoped', 'seamless', 'selected', 'sortable', 'typemustmatch'
];

module.exports = {
    nodeType: nodeType,
    tagTypeMap: tagTypeMap,
    booleanAttributes: booleanAttributes
};

},{}],5:[function(require,module,exports){
/**
 * @file util methods
 * @author nighca<nighca@live.cn>
 */

// copy properties from src to target
var extend = function (target, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) {
            target[key] = src[key];
        }
    }
    return target;
};

// 'a${x}c', {x:'b'} -> 'abc'
var format = function (template, vars) {
    return template.replace(/\$\{([^\{\}]*)\}/g, function (_, name) {
        var value = vars[name.trim()];
        return value == null ? '' : value + '';
    });
};

// repeat a string in given times
var repeat = function (str, num) {
    return Array.prototype.join.call({length: num + 1}, str);
};

// generate indent content
var indent = function (level, type, size) {
    return repeat(type === 'tab' ? '\t' : repeat(' ', size), level);
};

// is in an array
var isIn = function (obj, arr) {
    return arr.indexOf(obj) >= 0;
};

module.exports = {
    extend: extend,
    format: format,
    repeat: repeat,
    indent: indent,
    isIn: isIn
};

},{}]},{},[1])(1)
});