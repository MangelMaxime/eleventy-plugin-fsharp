/**
 * @type {import("ava").TestFn<T>}
 */
import test from "ava";
import skipUntil from "../../src/utils/skipUntil.js";

test('Return all the elements if predicate is always true', t => {
	const source = [1, 2, 3, 4, 5];
    const predicate = () => true;

    const result = skipUntil(source, predicate);
    t.deepEqual(result, source);
});

test('Return empty array if predicate is always false', t => {
    const source = [1, 2, 3, 4, 5];
    const predicate = () => false;

    const result = skipUntil(source, predicate);
    t.deepEqual(result, []);
});

test('Return empty array if source is empty', t => {
    const source = [];
    const predicate = () => true;

    const result = skipUntil(source, predicate);
    t.deepEqual(result, []);
});

test('Return all the elements that match the predicate', t => {
    const source = [1, 2, 3, 4, 5];
    const predicate = (value) => value >= 3;

    const result = skipUntil(source, predicate);
    t.deepEqual(result, [3, 4, 5]);
});
