import { test } from 'tape';
import { has, isEmpty, isObject } from '../dist/utils/object.js';

test('has should return true or false correctly', (t) => {
    const obj = {
        prop: 1
    };

    t.equal(has(obj, 'prop'), true);
    t.equal(has(obj, 'name'), false);
    t.end();
});

test('isEmpty should check weather an object is empty or not', (t) => {
    const obj = {
        prop: 1
    };

    t.equal(isEmpty({}), true);
    t.equal(isEmpty(obj), false);
    t.end();
});

test('isEmpty should check weather an object is an object', (t) => {
    const obj = {
        prop: 1
    };

    t.equal(isObject({}), true);
    t.equal(isObject(obj), true);
    t.equal(isObject(123), false);
    t.equal(isObject('123'), false);
    t.equal(isObject(new Date()), false);
    t.equal(isObject(Number), false);
    t.end();
});
