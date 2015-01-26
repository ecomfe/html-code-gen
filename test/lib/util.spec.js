/**
 * @file test for util methods
 * @author nighca<nighca@live.cn>
 */

var path = require('path');
var util = require('../../lib/util');
var packageInfo = require('../../package.json');

describe('extend', function () {
    var extend = util.extend;

    describe('extend object', function () {
        var result = extend(
            {
                a: 1,
                b: 1
            },
            {
                b: 2,
                c: 3,
                __proto__: {
                    d: 4
                }
            }
        );

        it('should return right result', function () {
            expect(result.a).toBe(1);
            expect(result.b).toBe(2);
            expect(result.c).toBe(3);
            expect(result.d).toBe(undefined);
        });
    });
});

describe('format', function () {
    var format = util.format;

    describe('format tpl', function () {
        var result = format(
            '${a},${b},${c},${d},${e},${f}',
            {
                a: 1,
                b: '2',
                c: null,
                d: true,
                e: false
            }
        );

        it('should return right result', function () {
            expect(result).toBe('1,2,,true,false,');
        });
    });
});

describe('repeat', function () {
    var repeat = util.repeat;

    describe('repeat string', function () {
        var result1 = repeat('', 2),
            result2 = repeat('abc', 0),
            result3 = repeat('abc', 1),
            result4 = repeat('abc', 2);

        it('should return right result', function () {
            expect(result1).toBe('');
            expect(result2).toBe('');
            expect(result3).toBe('abc');
            expect(result4).toBe('abcabc');
        });
    });
});

describe('indent', function () {
    var indent = util.indent;

    describe('output indent', function () {
        var result1 = indent(-1, 'space', 2),
            result2 = indent(0, 'space', 2),
            result3 = indent(1, 'space', 2),
            result4 = indent(2, 'space', 2),
            result5 = indent(2, 'space', 4),
            result6 = indent(1, 'tab'),
            result7 = indent(2, 'tab');

        it('should return right result', function () {
            expect(result1).toBe('');
            expect(result2).toBe('');
            expect(result3).toBe('  ');
            expect(result4).toBe('    ');
            expect(result5).toBe('        ');
            expect(result6).toBe('\t');
            expect(result7).toBe('\t\t');
        });
    });
});

describe('isIn', function () {
    var isIn = util.isIn;

    describe('judge if in an array', function () {
        var result1 = isIn(1, []),
            result2 = isIn(1, [1]),
            result3 = isIn(1, [1, 2]),
            result4 = isIn(2, [1, 2]),
            result5 = isIn(3, [1, 2]),
            result6 = isIn(undefined, [1, 2, undefined]),
            result7 = isIn(null, [1, 2, null]),
            result8 = isIn(null, [1, 2]);

        it('should return right result', function () {
            expect(result1).toBe(false);
            expect(result2).toBe(true);
            expect(result3).toBe(true);
            expect(result4).toBe(true);
            expect(result5).toBe(false);
            expect(result6).toBe(true);
            expect(result7).toBe(true);
            expect(result8).toBe(false);
        });
    });
});
