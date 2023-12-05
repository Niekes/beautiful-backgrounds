import { test } from 'tape';
import { getRandomInt } from '../dist/utils/number.js';

test('getRandomInt should return constant when min and max are the same', (t) => {
    t.equal(getRandomInt(0, 0), 0);
    t.equal(getRandomInt(100, 100), 100);
    t.end();
});
