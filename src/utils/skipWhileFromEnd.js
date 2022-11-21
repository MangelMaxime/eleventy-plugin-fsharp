// @ts-check

/**
 * Remove elements that match the predicate from the end of the array
 *
 * @template T
 * @param {T []} source The input array
 * @param {(value: T) => boolean} predicate A function that evaluates an element of the array to a boolean value
 * @returns The elements that match the predicate
 */
module.exports = function skipWhileFromEnd(
    source,
    predicate
) {
    let i = source.length - 1;
    while (i >= 0 && predicate(source[i])) {
        i--;
    }
    return source.slice(0, i + 1);
}
