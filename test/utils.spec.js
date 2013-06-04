var utils = require('../lib/utils');

describe('utils.isEqualObj()', function() {
    it('returns true for two empty object', function() {
        var a = {};
        var b = {};
        expect(utils.isEqualObj(a, b)).toBe(true);
    });

    it('returns true for two equal objects: {a:1, b:2, c:3}', function() {
        var a = {a: 1, b: 2, c: 3};
        var b = {a: 1, b: 2, c: 3};
        expect(utils.isEqualObj(a, b)).toBe(true);
    });

    it('returns true for two equal objects in different orders: {a:1, b:2, c:3}', function() {
        var a = {a: 1, b: 2, c: 3};
        var b = {c: 3, a: 1, b: 2};
        expect(utils.isEqualObj(a, b)).toBe(true);
    });

    it('returns false for two objects with different properties: {a:1, b:2, c:3} and {a:1, b:2, d:3}', function() {
        var a = {a: 1, b: 2, c: 3};
        var b = {a: 1, b: 2, d: 3};
        expect(utils.isEqualObj(a, b)).toBe(false);
    });

    it('returns false for two objects with different values: {a:1, b:2, c:3} and {a:1, b:2, c:5}', function() {
        var a = {a: 1, b: 2, c: 3};
        var b = {a: 1, b: 2, c: 5};
        expect(utils.isEqualObj(a, b)).toBe(false);
    });

    it('returns false for two objects with different lengths: {a:1, b:2, c:3} and {a:1, b:2, c:3, d:6}', function() {
        var a = {a: 1, b: 2, c: 3};
        var b = {a: 1, b: 2, c: 3, d:6};
        expect(utils.isEqualObj(a, b)).toBe(false);
    });
});

describe('utils.isEqual()', function() {
    it('returns true for two empty arrays', function() {
        var a = [];
        var b = [];
        expect(utils.isEqual(a, b)).toBe(true);
    });

    it('returns true for two equal arrays', function() {
        var a = [{a:1}, {a:2}, {a:3}];
        var b = [{a:1}, {a:2}, {a:3}];
        expect(utils.isEqual(a, b)).toBe(true);
    });

    it('returns true for two equal arrays in different orders', function() {
        var a = [{a:1}, {b:2}, {a:3}];
        var b = [{b:2}, {a:3}, {a:1}];
        expect(utils.isEqual(a, b)).toBe(true);
    });

    it('returns false for two arrays of different lengths', function() {
        var a = [{a:1}, {a:2}, {a:3}];
        var b = [{a:1}, {a:2}];
        expect(utils.isEqual(a, b)).toBe(false);
    });

    it('returns false for two different arrays', function() {
        var a = [{a:1}, {a:2}, {a:3}];
        var b = [{a:1}, {a:2}, {c:3}];
        expect(utils.isEqual(a, b)).toBe(false);
    });

    it('returns false for two different arrays', function() {
        var a = [{a:1}, {a:2}, {a:3}];
        var b = [{a:1}, {a:2}, {a:7}];
        expect(utils.isEqual(a, b)).toBe(false);
    });
});
