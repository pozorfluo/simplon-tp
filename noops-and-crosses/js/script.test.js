/**
 * @jest-environment jsdom
 */

const komrad = require('./script.ts');

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

test('adds 1 + 2 to equal 3', () => {
  expect(komrad.sum(1, 2)).toBe(3);
});

test('can call function defined inside module iife in this test file', () => {
    console.log(komrad);
    const timer = komrad.komrad().newTimer();
    expect(timer).not.toBeNull();
});