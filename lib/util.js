/**
 * @file util.js
 * @author nighca<nighca@live.cn>
 */

// 'a${x}c', {x:'b'} -> 'abc'
var format = function(template, vars) {
    return template.replace(/\$\{([^\{\}]*)\}/g, function(_, name) {
        var value = vars[name.trim()];
        return value == null ? '' : value + '';
    });
};

module.exports = {
	format: format
};