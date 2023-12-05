import { test } from 'tape';
import { has } from '../dist/utils/object.js';

test('has should return true or false correctly', (t) => {
    const obj = {
        prop: 1
    };

    t.equal(has(obj, 'prop'), true);
    t.equal(has(obj, 'name'), false);
    t.end();
});
