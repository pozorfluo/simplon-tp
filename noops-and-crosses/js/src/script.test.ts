// const sum = require('./script');

import { sum } from './script';

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
});

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// test('can call function defined inside module iife in this test file', () => {
//     const timer = komrad.komrad().newTimer();
//     expect(timer).not.toBeNull();
// });
