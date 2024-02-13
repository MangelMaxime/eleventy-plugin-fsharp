/**
 * @type {import("ava").TestFn<T>}
 */
import test from "ava";
import skipWhileFromEnd from "../../src/utils/skipWhileFromEnd.js";

test('Return an empty if predicate is always true', t => {
	const source = [1, 2, 3, 4, 5];
    const predicate = () => true;

    const result = skipWhileFromEnd(source, predicate);
    t.deepEqual(result, []);
});

test('Return all elements if predicate is always false', t => {
    const source = [1, 2, 3, 4, 5];
    const predicate = () => false;

    const result = skipWhileFromEnd(source, predicate);
    t.deepEqual(result, source);
});

test('Return empty array if source is empty', t => {
    const source = [];
    const predicate = () => true;

    const result = skipWhileFromEnd(source, predicate);
    t.deepEqual(result, []);
});

test('Return all the elements that match the predicate', t => {
    const source = [1, 2, 3, 4, 5];
    const predicate = (value) => value > 3;

    const result = skipWhileFromEnd(source, predicate);
    t.deepEqual(result, [1, 2, 3]);
});
