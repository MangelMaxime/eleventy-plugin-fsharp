// @ts-check

/**
 * Returns elements from the beginning of the array until the predicate is true
 *
 * @template T
 * @param {T []} source The input array
 * @param {(value: T) => boolean} predicate A function that evaluates an element of the array to a boolean value
 * @returns The rest of the array
 */
module.exports = function takeUntil(
    source,
    predicate
) {
    let i = 0;
    while (i < source.length && !predicate(source[i])) {
        i++;
    }

    return source.slice(0, i);
}
