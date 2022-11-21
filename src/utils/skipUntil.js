// @ts-check

/**
 * Skips items until the predicate is true and then returns the rest of the array
 *
 * @template T
 * @param {T []} array The input array
 * @param {(value: T) => boolean} predicate A function that evaluates an element of the array to a boolean value
 * @returns {T []} The rest of the array
 */
module.exports = function skipUntil(
    array,
    predicate
) {
    let i = 0;
    while (i < array.length && !predicate(array[i])) {
        i++;
    }

    return array.slice(i);
}
