import { test } from 'tape';
import { getRandomInt, getRandomFloat, interpolateLinear } from '../dist/utils/number.js';

test('getRandomInt should return random int within min max range', (t) => {
    const randomInt = getRandomInt(0, 100);

    t.equal(getRandomInt(0, 0), 0);
    t.equal(getRandomInt(100, 100), 100);
    t.equal(typeof randomInt, 'number');
    t.equal(randomInt <= 100 && randomInt >= 0, true);
    t.end();
});

test('getRandomFloat should return random int within min max range', (t) => {
    const randonFloat = getRandomFloat(0, 100);

    t.equal(getRandomFloat(0.1, 0.1), 0.1);
    t.equal(getRandomFloat(99.99, 99.99), 99.99);
    t.equal(typeof randonFloat, 'number');
    t.equal(randonFloat <= 100 && randonFloat >= 0, true);
    t.end();
});

test('interpolateLinear should return random int within min max range', (t) => {
    const value1 = interpolateLinear(0.5, 0, 1, 0, 10);
    const value2 = interpolateLinear(0.5, 0, 1, 0, 100);
    const value3 = interpolateLinear(1.2, 0, 1, 0, 10);
    const value4 = interpolateLinear(-30, 0, 1, 0, 10);
    const value5 = interpolateLinear(0, -100, 100, -1, 1);

    t.equal(value1, 5);
    t.equal(value2, 50);
    t.equal(value3, 10);
    t.equal(value4, 0);
    t.equal(value5, 0);
    t.equal(typeof value1, 'number');
    t.equal(typeof value2, 'number');
    t.equal(typeof value3, 'number');
    t.equal(typeof value4, 'number');
    t.equal(typeof value5, 'number');
    t.end();
});
